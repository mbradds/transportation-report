--use CTS;
--go
SELECT 
[Year],
[Mode Simple] as [Mode],
sum([Volume (bbl/d)]) as [Volume (bbl/d)]
FROM (
SELECT YEAR(VCALID.ReportingPeriod) as [Year], 
VCALID.OilStreamRouteName as [Mode],
case when VCALID.OilStreamRouteName in ('Truck')
then 'Truck'
when VCALID.OilStreamRouteName in ('Marine','Transmountain/Marine','Interprovincial/Marine','Railroad/Marine')
then 'Marine'
when VCALID.OilStreamRouteName in ('Railroad')
then 'Railroad'
else 'Pipeline'
end as [Mode Simple],
SUM(VCALID.Volume) / DATEPART(dy, DATEFROMPARTS(YEAR(VCALID.ReportingPeriod),12,31)) AS [Volume (m3/d)],
SUM(VCALID.ImperialVolume) / DATEPART(dy, DATEFROMPARTS(YEAR(VCALID.ReportingPeriod),12,31)) AS [Volume (bbl/d)]
FROM vwCrudeActivityLineItemDetail AS VCALID 
LEFT OUTER JOIN Location AS L ON L.LocationId = VCALID.DestinationLocationId
WHERE VCALID.[Status] = 'SUB' AND VCALID.[IsPublished] = 1 AND (VCALID.DestinationCountryId IS NOT NULL OR L.PADDId IS NOT NULL) AND Year(VCALID.ReportingPeriod) >= 2015
AND Year(VCALID.ReportingPeriod) <= 2019
GROUP BY VCALID.OilStreamRouteName, YEAR(VCALID.ReportingPeriod)
) T
where [Mode Simple] <> 'Truck'
group by [Year],[Mode Simple]
ORDER BY [Year], [Mode Simple]