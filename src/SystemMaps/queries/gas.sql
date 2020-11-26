SELECT [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type],
'Natural Gas' as [Product],
round(avg([Throughput (1000 m3/d)]),1) as [Throughput (1000 m3/d)],
round(avg([Capacity (1000 m3/d)]),1) as [Available Capacity (1000 m3/d)]
FROM [EnergyData].[dbo].[Pipelines_Gas] where [Year] = '2019'
group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow], [Trade Type]
order by [Corporate Entity],[Pipeline Name],[Key Point]