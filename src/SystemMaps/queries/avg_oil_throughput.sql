select [Year],[Corporate Entity],[Pipeline Name],
round(avg([Throughput (1000 m3/d)]),1) as [Throughput (1000 m3/d)]
from(SELECT [Month],[Year],[Corporate Entity],[Pipeline Name],
sum([Throughput (1000 m3/d)]) as [Throughput (1000 m3/d)]
FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput
where [Year] = '2019' group by [Year],[Month],[Corporate Entity],[Pipeline Name]
) as monthly_avg group by [Year],[Corporate Entity],[Pipeline Name]