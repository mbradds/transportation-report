import geopandas as gpd
import os
import pandas as pd
from os import listdir
from os.path import isfile, join
import pyproj #for checking the epsg code of projected CRS
import matplotlib.pyplot as plt
import sys
script_dir = os.path.dirname(__file__)
os.chdir(script_dir)
from connection import cer_connection
crs_hc3 = "+proj=lcc +lat_1=50 +lat_2=70 +lat_0=40 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs"
#%%
oil_pipelines = [ 'Milk River Pipeline', 
         'Trans-Northern Pipeline', 
         'Cochin Pipeline', 
         'Montreal Pipeline', 
         'Trans Mountain Pipeline', 
         'Keystone Pipeline', 
         'Express Pipeline', 
         'Norman Wells Pipeline', 
         'Wascana Pipeline', 
         'Enbridge Bakken System', 
         'Westspur Pipeline', 
         'Enbridge Canadian Mainline', 
         'Aurora Pipeline', 
         'Southern Lights Pipeline']

gas_pipelines = ['Many Islands Pipeline', 
         'M&NP Pipeline', 
         'TC Canadian Mainline', 
         'NGTL System', 
         'Alliance Pipeline', 
         'TQM Pipeline', 
         'Foothills System', 
         'Genesis Pipeline', 
         'Enbridge BC Pipeline', 
         'Vector Pipeline']

  
oil_query = "select oil.Year,oil.[Corporate Entity],oil.[Pipeline Name],oil.[Key Point],oil.[Direction of Flow],oil.[Trade Type],oil.Product, \
avg(oil.[Throughput (1000 m3/d)]) as [Throughput (1000 m3/d)],avg(oil.[Available Capacity (1000 m3/d)]) as [Available Capacity (1000 m3/d)] \
from (SELECT throughput.[Month],throughput.[Year],throughput.[Corporate Entity],throughput.[Pipeline Name],throughput.[Key Point], \
[Direction of Flow],[Trade Type],[Product],[Throughput (1000 m3/d)], \
capacity.[Available Capacity (1000 m3/d)] FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput \
left join [EnergyData].[dbo].[Pipelines_Capacity_Oil] as capacity on throughput.Year = capacity.Year and throughput.Month = capacity.Month \
and throughput.[Corporate Entity] = capacity.[Corporate Entity] and throughput.[Pipeline Name] = capacity.[Pipeline Name] \
and throughput.[Key Point] = capacity.[Key Point] where throughput.[Corporate Entity] <> 'Trans Mountain Pipeline ULC' and throughput.Year = '2019' \
union all \
SELECT throughput.[Month],throughput.[Year],throughput.[Corporate Entity],throughput.[Pipeline Name],throughput.[Key Point], \
[Direction of Flow],[Trade Type],[Product],[Throughput (1000 m3/d)], \
capacity.[Available Capacity (1000 m3/d)] \
FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput \
left join [EnergyData].[dbo].[Pipelines_Capacity_Oil] as capacity on throughput.Year = capacity.Year and throughput.Month = capacity.Month \
and throughput.[Corporate Entity] = capacity.[Corporate Entity] and throughput.[Pipeline Name] = capacity.[Pipeline Name] \
where throughput.[Corporate Entity] = 'Trans Mountain Pipeline ULC' and throughput.Year = '2019' \
) as oil group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type],Product"

gas_query = "SELECT [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type], \
'Natural Gas' as [Product], \
round(avg([Throughput (1000 m3/d)]),1) as [Throughput (1000 m3/d)], \
round(avg([Capacity (1000 m3/d)]),1) as [Available Capacity (1000 m3/d)] \
FROM [EnergyData].[dbo].[Pipelines_Gas] where [Year] = '2019' \
group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow], [Trade Type] \
order by [Corporate Entity],[Pipeline Name],[Key Point]"
   
size = "throughput"

def params(query, min_buffer=5,max_buffer=15):
 
    conn,engine = cer_connection()
    df = pd.read_sql_query(query,con=conn)
    df = df.sort_values(by=['Corporate Entity','Pipeline Name','Throughput (1000 m3/d)'],ascending=False)
    df = df.groupby(['Corporate Entity','Pipeline Name','Year','Key Point','Direction of Flow']).agg(
                                                                     product=('Product',list),
                                                                     tradeType=('Trade Type',list),
                                                                     #keyPoints=('Key Point',list),
                                                                     throughput=('Throughput (1000 m3/d)','sum'),
                                                                     availableCapacity=('Available Capacity (1000 m3/d)','max')).reset_index()

    max_point = []
    for company in list(set(df['Corporate Entity'])):
        dfc = df[df['Corporate Entity']==company].copy()
        dfc['Direction of Flow'] = list(dfc['Direction of Flow'])
        dfc['product'] = list(dfc['product'])
        dfc['tradeType'] = list(dfc['tradeType'])
        dfc['Total Throughput'] = sum(dfc['throughput'])
        #dfc['availableCapacity'] = max(dfc['availableCapacity'])
        dfc = dfc[dfc['throughput']==max(dfc['throughput'])].copy()
        max_point.append(dfc)
    df = pd.concat(max_point, axis=0, sort=False, ignore_index=True)
                                                                
    df['Capacity Utilization'] = (df['throughput']/df['availableCapacity']).round(2)
    df['Total'] = sum(df['throughput'])
    df['Percent'] = (df[size]/df['Total']).round(3)
    lists = ['product','tradeType']
    for l in lists:
        df[l] = [list(set(x)) for x in df[l]]
        df[l] = [' - '.join(list(x)) for x in df[l]]
    
    diff = max_buffer - min_buffer
    df['buffer'] = [(pct*diff)+min_buffer for pct in df['Percent']]
    del df['Total']
    del df['Percent']
    if query == oil_query:
        df['Corporate Entity'] = df['Corporate Entity'].replace({
            'Enbridge Pipelines Inc.':'Enbridge Canadian Mainline',
            'Enbridge Pipelines (NW) Inc.':'Norman Wells Pipeline',
            'PKM Cochin ULC':'Cochin Pipeline',
            'TransCanada Keystone Pipeline GP Ltd.':'Keystone Pipeline',
            'Trans Mountain Pipeline ULC':'Trans Mountain Pipeline',
            'Trans-Northern Pipelines Inc.':'Trans-Northern Pipeline',
            'TEML Westpur Pipelines Limited (TEML)':'Westspur Pipeline'})
    
        for col in ['throughput','availableCapacity']:
            df[col] = (df[col]*6.2898).round(1)
    
    if query == gas_query:
        df['Corporate Entity'] = df['Corporate Entity'].replace({
            'Foothills Pipe Lines Ltd. (Foothills)':'Foothills System',
            'Trans Québec & Maritimes Pipeline Inc':'TQM Pipeline',
            'Westcoast Energy Inc.':'Enbridge BC Pipeline',
            'Maritimes & Northeast Pipeline':'M&NP Pipeline',
            'NOVA Gas Transmission Ltd. (NGTL)':'NGTL System',
            'Alliance Pipeline Limited Partnership':'Alliance Pipeline',
            'TransCanada PipeLines Limited':'TC Canadian Mainline'})
    conn.close()
    return df


def import_prototype():
    read_path = os.path.join(os.getcwd(),'Data/pipeline.json')
    df = gpd.read_file(read_path)
    df = df.set_geometry('geometry')
    #df = df.to_crs(crs_hc3)
    #df.crs = crs_hc3
    for delete in ['Commodity','Regulator']:
        del df[delete]
    df = df[df['Company'] != "N/A"]
    return df
     

def export_files(df,folder="Data/pipeline_output/oil",name="pipe.geojson"):
    df = df[~df.geometry.is_empty]
    df = df[df.geometry.notna()]
    write_path = os.path.join(os.getcwd(),folder,name)
    df.to_file(write_path, driver='GeoJSON')
    #print('exported: '+name+' to geojson','with CRS: '+str(df.crs))
    

def filter_shape(pipes,commodity='oil'):
    if commodity == 'oil':
        ranges = params(oil_query,5,40)
        pipelines = oil_pipelines
    if commodity == 'gas':
        ranges = params(gas_query,5,20)
        pipelines = gas_pipelines
        
    for pipe_name in pipelines:
        try:    
            r = ranges[ranges['Corporate Entity']==pipe_name].copy()
            r_buffer = list(r['buffer'])[0]
        except:
            r = pd.DataFrame()
            r_buffer = 5
        
        print(pipe_name)
        if pipe_name != None:
            pipe = pipes[pipes['Pipeline_S']==pipe_name].copy()
            #pipe = pipe.dissolve(by='Pipeline_S')
            #pipe = pipe.reset_index()
            buffer_meters = (r_buffer * 1000) * 1.60934
            pipe['geometry'] = pipe['geometry'].buffer(buffer_meters)
            pipe = pipe.dissolve(by='Pipeline_S')
            pipe = pipe.reset_index()
            #pipe['geometry'] = pipe['geometry'].simplify(10)
            try:
                if not r.empty:    
                    pipe = pipe.merge(r,how='left',left_on='Pipeline_S',right_on='Corporate Entity')
                    return pipe
                export_files(pipe,folder="Data/pipeline_output/"+commodity,name=pipe_name+'.json')
            except:
                print('failed: '+pipe_name)
                raise
                return pipe
            
    
def plot_map(map_layer,pipe_layer):
    print('pipe crs '+ str(pipe_layer.crs))
    print('map crs '+ str(map_layer.crs))
    fig, ax1 = plt.subplots(figsize=(24,24))
    map_layer.plot(ax=ax1)
    pipe_layer.plot(ax = ax1,color='yellow',edgecolor='black')
    plt.savefig('enbridge.png')
    
def pipe_file_names(mypath):
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    print(onlyfiles)
    
def import_one_pipe(name="ENBRIDGE PIPELINES INC.json"):
    read_path = os.path.join(os.getcwd(),'pipeline_output/oil/',name)
    df = gpd.read_file(read_path)
    return df


if __name__ == "__main__":
    #TODO: remove some of the pipeline/corporate names in pipe outputs
    pipe = import_prototype()
    #oil = params(oil_query)
    #gas = params(gas_query)
    oil_error = filter_shape(pipe,commodity='oil')
    #gas_error = filter_shape(pipe,commodity='gas')
    #plot_map(statsCan,pipe)
    #enb = import_one_pipe(name="EXPRESS PIPELINE LTD.json")
    
    