select [Date],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type],[Product],[Units],[Throughput]
from
(
SELECT
cast(cast([Month] as nvarchar(2))+'-'+'1'+'-'+cast([Year] as nvarchar(4)) as date) as [Date],  
[Corporate Entity],
[Pipeline Name],
[Key Point],
[Direction of Flow],
[Trade Type],
[Product],
round([Throughput (1000 m3/d)],2) as [1000 m3/d],
round([Throughput (1000 m3/d)]*6.2898,2) as [1000 b/d]
FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil]
) as unTidy
unpivot
(Throughput FOR Units in ([1000 m3/d],[1000 b/d])
) as tidy
order by [Pipeline Name],[Corporate Entity],Product,[Date]