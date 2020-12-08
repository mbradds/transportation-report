SELECT 
[Location],
cast(str(month(Date))+'-'+'1'+'-'+str(year(Date)) as date) as [Date],
round(avg([Price ($CN/GIG)]),2) as [Price ($CN/GIG)]
--round(avg([Price ($US/MMB)]),2) as [Price ($US/MMB)]
FROM [EnergyData].[dbo].[vwPlatts_NextDay_converted]
where [Location] in ('Henry Hub TDt Com','Dawn Ontario TDt Com','TC Alb AECO-C TDt Com Dly','Westcoast Stn 2 TDt Com')
group by [Location], year([Date]), month([Date])
having (round(avg([Price ($CN/GIG)]),2) is not null) and (round(avg([Price ($US/MMB)]),2) is not null)
order by year([Date]), month([Date]), [Location]