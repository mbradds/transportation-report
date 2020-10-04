select 
[Date],
sum([Capacity (1000 m3/d)]) as [Capacity (1000 m3/d)]
from
(
SELECT 
cast(str([Month])+'-'+'1'+'-'+str([Year]) as date) as [Date],
[Corporate Entity],[Pipeline Name], [Key Point],
round(avg([Capacity (1000 m3/d)]),1) as [Capacity (1000 m3/d)]
FROM [EnergyData].[dbo].[Pipelines_Gas]
where
[Year] >= '2015' and
([Corporate Entity] = 'Alliance Pipeline Limited Partnership' and [Key Point] = 'Border') or
([Corporate Entity] = 'Westcoast Energy Inc.' and [Key Point] = 'Kingsvale') or
([Corporate Entity] = 'Foothills Pipe Lines Ltd. (Foothills)' and [Key Point] in ('Kingsgate','Monchy')) or
([Corporate Entity] = 'TransCanada PipeLines Limited' and [Key Point] = 'Northern Ontario Line') 
group by [Year],[Month],[Corporate Entity],[Pipeline Name], [Key Point]
) as gas_cap
where year([Date]) >= '2015'
group by [Date]
order by [Date]
