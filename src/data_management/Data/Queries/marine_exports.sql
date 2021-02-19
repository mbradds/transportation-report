select
marine.[Date],
round(marine.[ImperialVolume]/
datediff(day, dateadd(day, 1-day([Date]), [Date]),
              dateadd(month, 1, dateadd(day, 1-day([Date]), [Date])))/1000,2) as [Mb/d]
from
(
select
year(VCALID.ReportingPeriod) as [Year],
month(VCALID.ReportingPeriod) as [Month],
cast(str(month(VCALID.ReportingPeriod))+'-'+'1'+'-'+str(year(VCALID.ReportingPeriod)) as date) as [Date],
sum(VCALID.ImperialVolume) as [ImperialVolume]
FROM vwCrudeActivityLineItemDetail AS VCALID 
LEFT OUTER JOIN Location AS L ON L.LocationId = VCALID.DestinationLocationId
WHERE VCALID.[Status] = 'SUB' AND 
VCALID.[IsPublished] = 1 AND (VCALID.DestinationCountryId IS NOT NULL OR L.PADDId IS NOT NULL) 
AND Year(VCALID.ReportingPeriod) >= 2015 and
VCALID.OilStreamRouteName in ('Marine','Transmountain/Marine','Interprovincial/Marine','Railroad/Marine')
group by year(VCALID.ReportingPeriod), month(VCALID.ReportingPeriod)
--order by cast(str(month(VCALID.ReportingPeriod))+'-'+'1'+'-'+str(year(VCALID.ReportingPeriod)) as date)
) as marine
order by marine.Date