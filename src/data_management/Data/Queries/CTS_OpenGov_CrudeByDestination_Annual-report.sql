SELECT [Year], PADD, [Volume (bbl/d)] as [Value]

FROM (
SELECT  R.[Year], R.PaddID as PaddID, R.PADDName AS [PADD],
CASE WHEN F.ConfidentialityFlag = 1 THEN 'Confidential' ELSE str(R.[Volume (m3/d)], 15, 1) END AS [Volume (m3/d)], 
CASE WHEN F.ConfidentialityFlag = 1 THEN 'Confidential' ELSE str(R.[Volume (bbl/d)], 15, 1) END AS [Volume (bbl/d)], 
CASE WHEN F.ConfidentialityFlag = 1 THEN 'Confidential' ELSE str(R.[Value (CN$)], 15, 1) END AS [Value (CN$)],
CASE WHEN F.ConfidentialityFlag = 1 THEN 'Confidential' ELSE str(R.[Value (US$)], 15, 1) END AS [Value (US$)],
CASE WHEN F.ConfidentialityFlag = 1 THEN 'Confidential' ELSE str(R.[Price (CN$/m3)], 15, 2) END AS [Price (CN$/m3)],
CASE WHEN F.ConfidentialityFlag = 1 THEN 'Confidential' ELSE str(R.[Price (US$/bbl)], 15, 2) END AS [Price (US$/bbl)]

FROM (
SELECT  YEAR(VCALID.ReportingPeriod) as [Year],
        CASE WHEN (VCALID.DestinationCountryId IS NOT NULL OR L.PADDID is NULL) THEN 6 ELSE L.PaddId END PaddId, 
        CASE WHEN (VCALID.DestinationCountryId IS NOT NULL OR L.PADDID is NULL) THEN 'Other' ELSE P.ShortName END PADDName,
		SUM(VCALID.Volume) / DATEPART(dy, DATEFROMPARTS(YEAR(VCALID.ReportingPeriod),12,31)) AS [Volume (m3/d)],
		SUM(VCALID.ImperialVolume) / DATEPART(dy, DATEFROMPARTS(YEAR(VCALID.ReportingPeriod),12,31)) AS [Volume (bbl/d)],
		SUM(VCALID.Volume * VCALID.Price) AS [Value (CN$)], 
		SUM(VCALID.ImperialVolume * VCALID.ImperialPrice) AS [Value (US$)],
		SUM(VCALID.Volume * VCALID.Price) / SUM(VCALID.Volume) AS [Price (CN$/m3)], 
		SUM(VCALID.ImperialVolume * VCALID.ImperialPrice) / SUM(VCALID.ImperialVolume) AS [Price (US$/bbl)]
FROM vwCrudeActivityLineItemDetail AS VCALID
		LEFT OUTER JOIN Location AS L ON L.LocationId = VCALID.DestinationLocationId
		LEFT OUTER JOIN PADD AS P ON P.PaddId = L.PADDId
WHERE VCALID.[IsPublished] = 1 AND VCALID.[Status] = 'SUB' AND (L.CountryId != 42 OR VCALID.DestinationLocationId is NULL)
GROUP BY CASE WHEN (VCALID.DestinationCountryId IS NOT NULL OR L.PADDID is NULL) THEN 6 ELSE L.PaddId END, 
        CASE WHEN (VCALID.DestinationCountryId IS NOT NULL OR L.PADDID is NULL) THEN 'Other' ELSE P.ShortName END,
		 YEAR(ReportingPeriod)
	) R
LEFT OUTER JOIN dbo.[fnConfidentialityByGroupColumnForReportingPeriodType]('PADDId', '19850101', getdate(), 'YEAR', 43, 1, 7, NULL) F 
ON  R.PADDId = F.GroupById  AND R.[Year] = F.ReportingPeriod 

) T
WHERE [Year] >= 2015
ORDER BY [Year], PaddId