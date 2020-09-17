
SELECT 
fin.[Company],
fin.[Filing],
fin.[Approved?],
fin.[ALL Class],
fin.[Reliance on Parental Funds?],
fin.[variable],
fin.[notes],
fin.[values] as [Financial Resource],
limit.[values] as [Financial Resource Minimum],
fin.[currency]

FROM [EnergyData].[dbo].[Pipeline_Fin_Resource] as fin

inner join
(

SELECT 
[Company],
[Filing],
[Approved?],
[ALL Class],
[Reliance on Parental Funds?],
[variable],
[notes],
[values],
[currency]

FROM [EnergyData].[dbo].[Pipeline_Fin_Resource] 

) as limit

on fin.Company = limit.Company 

where limit.variable = 'ALL Limit' and fin.variable <> 'ALL Limit'