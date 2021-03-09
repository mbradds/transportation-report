select rail.Date,rail.Units,
round(rail.Volume,1) as [Crude by Rail],
round(wcs.[WCS Differential],1) as [WCS-WTI Differential]
from (
SELECT 
[Date],
[Volume],
[Units]
FROM [EnergyData].[dbo].[NEB_RailExports_Oil] 
where Units in ('bbl per day','m3 per day')
union all
select 
cast('2020-11-01' as date) as [Date],
27507 as [Volume],
'm3 per day' as [Units]
union all
select
cast('2020-11-01' as date) as [Date],
173095 as [Volume],
'bbl per day' as [Units]
union all
select 
cast('2020-12-01' as date) as [Date],
30265 as [Volume],
'm3 per day' as [Units]
union all
select
cast('2020-12-01' as date) as [Date],
190454 as [Volume],
'bbl per day' as [Units]
) as rail left join (
SELECT 
year([SettlementDate]) as [Year],
month([SettlementDate]) as [Month],
round(avg([SettlementValue]),2)*-1 as [WCS Differential]
FROM [EnergyData].[dbo].[Net_Energy_Spot] where Market = 'WCS'
group by year([SettlementDate]),month([SettlementDate])) as wcs
on year(rail.Date) = wcs.Year and month(rail.Date) = wcs.Month where year(rail.Date) >= 2015
order by rail.Units, rail.Date
