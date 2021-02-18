SELECT 
YEAR([ReportingPeriod]) as [Year], 
Activity, 
ISNULL(NERC.Name, PortName) as [Region],
round(sum([Volume (10^3 m3)]),2) as [Volume (Thousand m3)], 
round(sum([Volume (MCF)]),2) as [Volume (MCF)]

FROM 
(
SELECT I.*, F.ConfidentialityFlag, FT.ConfidentialityFlag AS TotalConfidentialityFlag 
FROM (
SELECT 'Exports' as Activity, ReportingPeriod, PortId, PortName, RegionId,
SUM(Volume) AS [Volume (10^3 m3)], 
SUM(ImperialVolume) [Volume (MCF)],
SUM(Value) AS [Value (CN$)],
SUM(USDValue) AS [Value (US$)], 
SUM(Value) / SUM(Energy) AS [Price (CN$/GJ)],
SUM(USDValue) / SUM(ImperialEnergy) [Price (US$/MMBTU)]
FROM vwGasActivityLineItemDetail
WHERE ActivityTypeID = 33 AND CommodityCode = 'Gas' AND [IsPublished] = 1 AND [Status] = 'SUB'
GROUP BY ReportingPeriod, PortId, PortName, RegionId
) I 
LEFT OUTER JOIN dbo.fnConfidentialityByGroupColumnForReportingPeriod('PortId', 33, 1, 4, NULL) F ON I.ReportingPeriod = F.ReportingPeriod AND I.PortId = F.GroupById
LEFT OUTER JOIN dbo.fnConfidentialityByGroupColumnForReportingPeriod(NULL, 33, 1, 4, NULL) FT ON I.ReportingPeriod = FT.ReportingPeriod

UNION ALL 

SELECT I.*, F.ConfidentialityFlag, FT.ConfidentialityFlag AS TotalConfidentialityFlag 
FROM (
SELECT 'Imports' as Activity, ReportingPeriod, PortId, PortName, RegionId,
SUM(Volume) AS [Volume (10^3 m3)], 
SUM(ImperialVolume) [Volume (MCF)],
SUM(Value) AS [Value (CN$)],
SUM(USDValue) AS [Value (US$)], 
SUM(Value) / SUM(Energy) AS [Price (CN$/GJ)],
SUM(USDValue) / SUM(ImperialEnergy) [Price (US$/MMBTU)]
FROM vwGasActivityLineItemDetail
WHERE ActivityTypeID = 37 AND CommodityCode = 'Gas' AND [IsPublished] = 1 AND [Status] = 'SUB'
GROUP BY ReportingPeriod, PortId, PortName, RegionId
) I 
LEFT OUTER JOIN dbo.fnConfidentialityByGroupColumnForReportingPeriod('PortId', 37, 1, 4, NULL) F ON I.ReportingPeriod = F.ReportingPeriod AND I.PortId = F.GroupById
LEFT OUTER JOIN dbo.fnConfidentialityByGroupColumnForReportingPeriod(NULL, 37, 1, 4, NULL) FT ON I.ReportingPeriod = FT.ReportingPeriod

) T
LEFT OUTER JOIN NERCRegion NERC ON NERC.RegionId = T.RegionId
where YEAR([ReportingPeriod]) >= '2015'
group by YEAR([ReportingPeriod]), Activity, ISNULL(NERC.Name, PortName)
ORDER BY YEAR([ReportingPeriod]), Activity

