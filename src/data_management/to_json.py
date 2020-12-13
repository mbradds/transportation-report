import pandas as pd
import json
import os
import io
from datetime import date
from calendar import monthrange
import calendar
from dateutil.relativedelta import relativedelta
import numpy as np
script_dir = os.path.dirname(__file__)
os.chdir(script_dir)
from connection import cer_connection

#%%
def normalize_dates(df,date_list):
    for date_col in date_list:
        df[date_col] = pd.to_datetime(df[date_col])
        df[date_col] = df[date_col].dt.date
    return df

def normalize_text(df,text_list):
    for text_col in text_list:
        df[text_col] = [x.strip() for x in df[text_col]]
    return df

def normalize_numeric(df,num_list,decimals):
    for num_col in num_list:
        df[num_col] = pd.to_numeric(df[num_col])
        df[num_col] = df[num_col].round(decimals)
    return df

def pipeline_names():
    read_path = os.path.join(os.getcwd(),'Data/','NEB_DM_PROD - 1271412 - Pipeline Naming Conventions.XLSX')
    df = pd.read_excel(read_path,sheet_name='Pipeline Naming Conventions')
    df = df.rename(columns={x:x.strip() for x in df.columns})
    df['old name'] = [x.strip() for x in df['Company List maintained by Tammy Walker https://www.cer-rec.gc.ca/bts/whwr/cmpnsrgltdbnb-eng.html']]
    df['new name'] = [x.strip() for x in df['Suggested Pipeline Name for ALL Future External Publications']]
    return {old_name:new_name for old_name,new_name in zip(df['old name'],
                                                           df['new name'])}

def daysInYear(year):
    d1 = date(year, 1, 1)
    d2 = date(year + 1, 1, 1)
    return (d2 - d1).days

def execute_sql(query_name):
    query_path = os.path.join(os.getcwd(),'Data/Queries/',query_name)
    def utf16open(query_path):
        file = io.open(query_path,mode='r',encoding="utf-16",errors='ignore')
        query = file.read()
        file.close()
        return query
    def no_encoding_open(query_path):
        file = io.open(query_path,mode='r',errors='ignore')
        query = file.read()
        file.close()
        return query
        
    try:
        query = utf16open(query_path)
    except:
        query = no_encoding_open(query_path)
    
    if query_name == 'crude_mode.sql':
        conn,engine = cer_connection(db='ndb-b1')
    else:
        conn,engine = cer_connection()
    df = pd.read_sql_query(query,con=conn)
    conn.close()
    
    return df

def saveJson(df,write_path,precision=2):
    df.to_json(write_path,orient='records',double_precision=precision,compression='infer')

def readCersei(query,name=None):

    df = execute_sql(query)
    if name == 'oil_prices.json':
        df = normalize_dates(df, ['Date'])
        df['Differential'] = (df['WTI'] - df['WCS'])*-1
        write_path = os.path.join(os.getcwd(),'Kevin/crude_prices/',name)
    if name == 'crude_mode.json':
        write_path = os.path.join(os.getcwd(),'Colette/crude_export_mode/',name)
    if name == 'crude_by_rail_wcs.json':
        df['Crude by Rail'] = [x/1000 if u=='bbl per day' else x for x,u in zip(df['Crude by Rail'],df['Units'])]
        df['Units'] = df['Units'].replace({'bbl per day':'Mb/d','m3 per day':'m3/d'})
        df = normalize_numeric(df, ['Crude by Rail'], 1)
        write_path = os.path.join(os.getcwd(),'Colette/crude_by_rail/',name)
    if name == 'gas_traffic.json':
        df = normalize_dates(df, ['Date'])
        write_path = os.path.join(os.getcwd(),'Sara/gas_traffic/',name)
    if name == 'fin_resource_totals.json':
        write_path = os.path.join(os.getcwd(),'Jennifer/financial_instruments/',name)
        for text_col in ['Financial Instrument','Commodity']:
            df[text_col] = [x.strip() for x in df[text_col]]
    if name == 'fin_resource_class.json':
        write_path = os.path.join(os.getcwd(),'Jennifer/financial_instruments/',name)
        for text_col in ['Pipeline Group','Commodity']:
            df[text_col] = [x.strip() for x in df[text_col]]
        df['Financial Resource'] = pd.to_numeric(df['Financial Resource'])
    if name == 'fin_resource_class_names.json':
        write_path = os.path.join(os.getcwd(),'Jennifer/financial_instruments/',name)
        df = normalize_text(df, ['ALL Class','Company'])
        df['Company'] = df['Company'].replace(pipeline_names())
        df['Company'] = df['Company'].replace({'Alliance Pipeline Limited Partnership':'Alliance Pipeline',
                                                'Maritimes & Northeast Pipeline Management Limited':'M&NP Pipeline',
                                                'Ovintiv Canada ULC (used to be Encana)':'Ovintiv Canada ULC',
                                                'Trans Quebec Maritimes Pipeline Inc.':'TQM Pipeline',
                                                'Westcoast Energy Inc.':'Enbridge BC Pipeline',
                                                'Express Pipeline Ltd., as a General Partner of Express Pipeline Limited Partnership':'Express Pipeline',
                                                'Enbridge Bakken Pipeline Company Inc., on behalf of Enrbidge Bakken Pipeline Limited Partnership':'Enbridge Bakken System',
                                                'Enbridge Southern Lights GP Inc. on behalf of enbridge Southern Lights LP':'Southern Lights Pipeline',
                                                'Kingston Midstream Westpur Limited (formerly TEML Westspur Pipelines Limited)':'Westspur Pipeline',
                                                'Trans Northern Pipelines Inc.':'Trans-Northern Pipeline'})
        classes = list(set(df['ALL Class']))
        names = {}
        for group in classes:
            dfg = df[df['ALL Class']==group].copy()
            names[group] = sorted(list(set(dfg['Company'])))
        
        with open(write_path, 'w') as f:
            json.dump(names, f)
        
    if name == 'gas_2019.json':
        write_path = os.path.join(os.getcwd(),'Sara/gas_2019/',name)
        df.loc[df['Corporate Entity'] == 'TransCanada PipeLines Limited', 'Pipeline Name'] = 'TC Canadian Mainline'
        df.loc[df['Corporate Entity'] == 'Maritimes & Northeast Pipeline', 'Pipeline Name'] = 'M&NP Pipeline'
        df['Pipeline Name'] = df['Pipeline Name'].replace({'BC Pipeline':'Enbridge BC Pipeline'})
        df['Key Point'] = df['Key Point'].replace({'Baileyville, Ma. / St. Stephen N.B.':'St. Stephen'})
        df['Series Name'] = df['Pipeline Name']+' - '+df['Key Point']+' - '+df['Trade Type']
        delete = ['Corporate Entity','Pipeline Name','Key Point','Trade Type']
        for d in delete:
            del df[d]
    if name == 'gas_prices.json':
        max_price,min_price = max(df['Price ($CN/GIG)']),min(df['Price ($CN/GIG)'])
        diff = max_price-min_price
        df['Price ($CN/GIG)'] = [((x-min_price)/diff)+min_price for x in df['Price ($CN/GIG)']]
        df['Location'] = df['Location'].replace({'Henry Hub TDt Com':'Henry Hub',
                                                 'Dawn Ontario TDt Com':'Dawn',
                                                 'TC Alb AECO-C TDt Com Dly':'Alberta NIT',
                                                 'Westcoast Stn 2 TDt Com':'Station 2'})
        write_path = os.path.join(os.getcwd(),'Rebecca/gas_prices/',name)
    
    if (name != None and name not in ['fin_resource_class_names.json','st_stephen.json','ns_offshore.json']):
        saveJson(df, write_path)
    return df


def readExcel(name,sheet='pq',sql=False):
    read_path = os.path.join(os.getcwd(),'Data/',name)
    df = pd.read_excel(read_path,sheet_name=sheet)
    
    if name == 'Crude_Oil_Production.xlsx':
        df['Year'] = pd.to_numeric(df['Year'])
        products = ['Conventional Light','Conventional Heavy','C5+','Field Condensate','Mined Bitumen','In Situ Bitumen']
        for crude in products:
            df[crude] = df[crude]/1000
        df = normalize_numeric(df, products, 3)
        write_path = os.path.join(os.getcwd(),'../Kevin/crude_production/',name.split('.')[0]+'.json')
        saveJson(df, write_path, precision=3)
    if name == 'UScrudeoilimports.xlsx':
        df['Attribute'] = [x.strip() for x in df['Attribute']]
        df['Attribute'] = df['Attribute'].replace({'Canadian imports':'U.S. crude oil imports from Canada', 
                                                   'ROW imports':'U.S. crude oil imports from ROW', 
                                                   'U.S crude oil exports':'U.S. crude oil exports'})

        df['Value'] = df['Value'].round(2)
        write_path = os.path.join(os.getcwd(),'../Kevin/us_imports/',name.split('.')[0]+'.json')
    if name == 'natural-gas-liquids-exports-monthly.xlsx':
        df['Period'] = pd.to_datetime(df['Period'],errors='raise')
        df['Days in Month'] = [monthrange(x.year,x.month)[-1] for x in df['Period']]
        df['Region'] = df['Region'].replace({'Québec':'Quebec'})
        df = df[df['Period'].dt.year >= 2015]
        df = df[df['Units']=='bbl'].copy()
        for delete in ['Units','Total']:
            del df[delete]
        
        for col in ['Pipeline','Railway','Truck','Marine']:
            df[col] = ((df[col]/df['Days in Month'])/1000).round(1)
        del df['Days in Month']
        df = normalize_dates(df, ['Period'])
        write_path = os.path.join(os.getcwd(),'../Ryan/ngl_exports/',name.split('.')[0]+'.json')
        #df.to_json(write_path,orient='records',force_ascii=False)
        
    if name == 'crude-oil-exports-by-destination-annual.xlsx':
        df = df[df['PADD'] != 'Total']
        df = df[df['Unit']!='m3/d']
        df['Value'] = (df['Value']/1000000).round(2)
        df['Unit'] = df['Unit'].replace({'bbl/d':'MMb/d'})
        write_path = os.path.join(os.getcwd(),'../Kevin/crude_exports/',name.split('.')[0]+'.json')
    
    if name == 'UScrudeoilimports.xlsx':
        df['Value'] = [round(x,2) for x in df['Value']]
        write_path = os.path.join(os.getcwd(),'../Kevin/us_imports/',name.split('.')[0]+'.json')
    
    if name == 'figures.xlsx' and sheet=='Available for Export':
        df = df.rename(columns={'TransMountain':'Trans Mountain Pipeline',
                                'Aurora/Rangeland':'Aurora Pipeline',
                                'Express':'Express Pipeline',
                                'Milk River':'Milk River Pipeline',
                                'Enbridge Mainline':'Enbridge Canadian Mainline',
                                'Keystone':'Keystone Pipeline'})
        
        df = df[df['Year']>=2015]
        write_path = os.path.join(os.getcwd(),'../Colette/crude_takeaway/',name.split('.')[0]+'.json')
    
    if name == 'marine_exports.xlsx':
        write_path = os.path.join(os.getcwd(),'../Colette/marine_exports/',name.split('.')[0]+'.json')
        del df['b/d']
        df['Thousand m3/d'] = df['Mb/d']
        df = normalize_numeric(df, ['Mb/d'], 1)
        df = normalize_dates(df, ['Date'])
        
    if name == 'figures.xlsx' and sheet=='ngl production':
        products = ['Ethane','Propane','Butanes']
        df = normalize_numeric(df, products, 1)
        write_path = os.path.join(os.getcwd(),'../Ryan/ngl_production/',name.split('.')[0]+'.json')
    
    if name == 'CrudeRawData-2019-01-01-2019-12-01.xlsx':
        df['Percent'] = df['Percent'].round(2)
        for delete in ['Value','Total Volume']:
            del df[delete]
        df = df[df['Attribute']!='Truck']
        df['Attribute'] = df['Attribute'].replace({'Railroad':'Rail'})
        write_path = os.path.join(os.getcwd(),'../Colette/crude_export_mode/',name.split('.')[0]+'.json')
    
    if name == 'Natural_Gas_Production.xlsx':
        df['Production Type'] = df['Production Type'].replace({'Non Associated':'Conventional Non-tight'})
        write_path = os.path.join(os.getcwd(),'../Rebecca/gas_production/',name.split('.')[0]+'.json')
    if name == 'natural-gas-exports-and-imports-annual.xlsx':
        cal = calendar.Calendar()
        df['Days in Year'] = [daysInYear(x) for x in df['Year']]
        df['Volume (Bcf/d)'] = (df['Volume (MCF)']/1000000)/df['Days in Year']
        df['Volume (Million m3/d)'] = (df['Volume (Thousand m3)']/1000)/df['Days in Year']
        for delete in ['Volume (MCF)','Days in Year','Volume (Thousand m3)']:
            del df[delete]
        df = normalize_numeric(df,['Volume (Bcf/d)','Volume (Million m3/d)'],2)
        write_path = os.path.join(os.getcwd(),'../Rebecca/gas_trade/',name.split('.')[0]+'.json')
    if name == 'CreditTables.xlsx':
        if sheet == 'ratings categories':
            df = normalize_text(df, ['Corporate Entity','Type','Credit Quality'])
            #allow for multiselect on company
            df = df[~df['Corporate Entity'].isin(['MPLL shareholders - Royal Dutch Shell Plc',
                                                  'MPLL shareholders - Suncor Energy Inc.',
                                                  'Plains All American Pipeline',
                                                  'MPLL shareholders - Imperial Oil Limited'])]
            
            df['Corporate Entity'] = df['Corporate Entity'].replace({'Kinder Morgan Canada Limited and Kinder Morgan Cochin ULC':'Kinder Morgan Canada Limited',
                                                                     'Trans Quebec & Maritimes Pipeline Inc.':'TQM Pipeline Inc.',
                                                                     'Alliance Pipeline Limited Partnership':'Alliance Pipeline L.P.'})
            df['series'] = df['Corporate Entity']+' - '+df['Type']
            for delete in ['Credit Quality','Corporate Entity','Type']:
                del df[delete]
            
            df = df[df['Year']>=2015]
            write_path = os.path.join(os.getcwd(),'../Jennifer/credit_ratings/',name.split('.')[0]+'.json')
        if sheet == 'Scale':
            write_path = os.path.join(os.getcwd(),'../Jennifer/credit_ratings/',sheet+'.json')
            del df['Level']
            df = df.rename(columns={'DBRS Morningstar':'DBRS','Level Inverted':'Level'})
            df = normalize_text(df, ["Credit Quality","DBRS","S&P","Investment Grade","Moody's"])
            levels = {}
            for index,l in enumerate(df['Level']):
                levels[l] = {"creditQuality":df['Credit Quality'][index],
                             "S&P":df['S&P'][index],
                             "DBRS":df['DBRS'][index],
                             "Moody's":df["Moody's"][index],
                             "investmentGrade":df['Investment Grade'][index]}
            with open(write_path, 'w') as f:
                json.dump(levels, f)
    if name == "abandonment funding data.xlsx":
        df = normalize_text(df, ['Company'])
        df = df[df['Company']!='Total Group 1 Pipelines']
        gas = ['TransCanada Pipelines Limited',
               'Nova Gas Transmission Ltd.',
               'Alliance Pipeline Ltd.',
               'Westcoast Transmission',
               'Foothills Pipelines Ltd.',
               'Maritimes & Northeast Pipeline Management Limited',
               'Trans Quebec & Maritimes Pipeline (TQM) Inc.']
        
        commodity = []
        for company in df['Company']:
            if company in gas:
                commodity.append('Gas')
            elif company in ['Total CER Regulated Pipelines','Total Group 2 Pipelines']:
                commodity.append('All')
            else:
                commodity.append('Oil')
        df['Commodity'] = commodity
        df['Remaining Estimate'] = df['ACE'] - df['Amounts Set Aside']
        df['Company'] = df['Company'].replace(pipeline_names())
        df = normalize_text(df,['Company'])
        df['Company'] = df['Company'].replace({'TransCanada Pipelines Limited':'TC Canadian Mainline',
                                                'Nova Gas Transmission Ltd.':'NGTL System',
                                                'Trans Mountain Pipeline Inc.':'Trans Mountain Pipeline',
                                                'Westcoast Transmission':'Enbridge BC Pipeline',
                                                'Foothills Pipelines Ltd.':'Foothills System',
                                                'Maritimes & Northeast Pipeline Management Limited':'M&NP Pipeline',
                                                'Trans Quebec & Maritimes Pipeline (TQM) Inc.':'TQM Pipeline',
                                                'PKM Cochin ULC':'Cochin Pipeline',
                                                'Total CER Regulated Pipelines':'Total CER Pipelines'})
        df = df.sort_values(by=['ACE'],ascending=False)
        write_path = os.path.join(os.getcwd(),'../Jennifer/abandonment_funding/',sheet+'.json')
        if sql:
            conn,engine = cer_connection()
            df.to_sql("Pipelines_Abandonment_Totals",con=conn,index=False,if_exists='replace')
            conn.close()
        
    #df = df.astype(object).where(pd.notnull(df), None)
    if sheet != 'Scale' and name != 'Crude_Oil_Production.xlsx':
        saveJson(df, write_path)
    return df

def readExcelPipeline(name,sheet='Data',sql=False):
    read_path = os.path.join(os.getcwd(),'Data/',name)
    df = pd.read_excel(read_path,sheet_name=sheet)
    text = ['Table','Owner','Pipeline','Category','Type','Unit']
    for t in text:
        df[t] = [x.strip() for x in df[t]]
        
    del df['Table']
    df['Value'] = pd.to_numeric(df['Value'],errors='coerce')
    df = df.astype(object).where(pd.notnull(df), None)
    
    df['Type'] = [[r.capitalize().strip() for r in x.split(' ')] for x in df['Type']]
    df['Type'] = [' '.join(x) for x in df['Type']]
    
    type_switch = {'Deemed Equity':'Deemed Equity Ratio',
                   'Return On Common Equity':'Actual Return on Equity',
                   'Return On Equity':'Actual Return on Equity',
                   'Achieved Return On Equity':'Actual Return on Equity',
                   'Total Revenue':'Revenue',
                   'Revenues':'Revenue',
                   'Rate Base [average Plant In Service]':'Rate Base',
                   'Average Rate Base':'Rate Base',
                   'Rate Of Return On Rate Base':'Return on Rate Base',
                   'Return On Net Plant':'Return on Net Plant',
                   'Cost Of Service':'Cost of Service',
                   'Return On Rate Base':'Return on Rate Base'}
    
    df['Type'] = df['Type'].replace(type_switch)
    df = df[df['Type'].isin(['Deemed Equity Ratio','Actual Return on Equity','Revenue','Rate Base'])]
    df['Pipeline'] = df['Pipeline'].replace({'Trans Québec & Maritimes Pipeline':'Trans Quebec & Maritimes Pipeline'})    
    oil_lines = ['Aurora Pipeline','Enbridge Mainline','Enbridge Norman Wells Pipeline','Express Pipeline','Cochin Pipeline','Milk River Pipeline','Montreal Pipeline','Southern Lights Pipeline','Trans Mountain Pipeline','Keystone Pipeline System','Trans-Northern Pipeline','Wascana','Westspur Pipeline']
    df['Category'] = ['Oil' if x in oil_lines else 'Gas' for x in df['Pipeline']]
    df['Pipeline'] = df['Pipeline'].replace({'Maritimes & Northeast Pipeline':'M&NP Pipeline', 
                                             'Westcoast Transmission System':'Enbridge BC Pipeline', 
                                             'NGTL':'NGTL System',
                                             'Foothills Pipeline System':'Foothills System', 
                                             'Enbridge Bakken Pipeline':'Enbridge Bakken System', 
                                             'Enbridge Mainline':'Enbridge Canadian Mainline', 
                                             'Trans Quebec & Maritimes Pipeline':'TQM Pipeline', 
                                             'Canadian Mainline':'TC Canadian Mainline', 
                                             'Keystone Pipeline System':'Keystone Pipeline',
                                             'Genesis Pipeline System':'Genesis Pipeline', 
                                             'Emera Brunswick Pipeline':'Brunswick Pipeline', 
                                             'Enbridge Norman Wells Pipeline':'Norman Wells Pipeline'})
    
    df = normalize_numeric(df, ['Value'], 0)
    df['Year'] = pd.to_numeric(df['Year'])
    df = df[df['Year']>=2015]
    df = df.sort_values(by=['Type','Category','Year','Value'])
    write_path = os.path.join(os.getcwd(),'../Cassandra/all_pipes/',name.split('.')[0]+'.json')
    del df['Owner']
    saveJson(df, write_path)
   
    if sql:
        conn,engine = cer_connection()
        df.to_sql('Pipeline_Financial_Metrics',con=conn,index=False,if_exists='replace')
        conn.close()
    return df


def writeExcelCredit(name,sheet='Credit Ratings',sql=False):
    read_path = os.path.join(os.getcwd(),'Data/',name)
    df = pd.read_excel(read_path,sheet)
    df['Value'] = [str(x).strip() for x in df['Value']]
    df['Value'] = df['Value'].replace({'-':None})
    #df = df.rename(columns={'Pipeline':'Corporate Entity'})
    df = normalize_text(df, ['Corporate Entity','Type','Value'])
    df['Value'] = df['Value'].replace({'A\xa0(low)':'A (low)','BBB(high)':'BBB (high)'})
    
    if sql:    
        conn,engine = cer_connection()
        df.to_sql('Pipeline_Financial_Ratings',con=conn,index=False,if_exists='replace')
        conn.close()
        
    return df


def financialResources(name='NEB_DM_PROD - 1267261 - Financial Resource Types - Data.XLSX',sql=False):
    
    def process_vals(x):
        x = x.split('$')
        x = [r.strip() for r in x]
        return x
    
    def apply_base(v,b):
        if b == 'million':
            v = v*1000000
        elif b == 'billion':
            v = v*1000000000
        elif b == 'thousand':
            v = v*1000
        return v
    
    read_path = os.path.join(os.getcwd(),'Data/',name)
    df = pd.read_excel(read_path,sheet_name='FinRes Types',skiprows=5)
    df.columns = [x.strip() for x in df.columns]
    del df['Notes']
    
    for col in df.columns:
        df[col] = df[col].astype('object')
        df[col] = [str(x).strip() for x in df[col]]
    
    df = pd.melt(df,id_vars=['Company','Filing','Approved?','ALL Class','Reliance on Parental Funds?'])
    df = df[(df['value']!='nan') & (df['value']!= '?')]
    #df['value'] = [x.split('$') for x in df['value']]
    df['value'] = [process_vals(x) for x in df['value']]
    notes,values,units = [],[],[]
    for vList in df['value']:
        if vList[0] != '':
            notes.append(vList[0])
            values.append('')
        else:
            notes.append('')
            values.append(vList[1].split(' '))
    df['notes'] = notes
    #df['values'] = values
    values_numeric,base,currency = [],[],[]
    for v in values:
        if type(v) == list:
            if len(v) > 2:
                currency.append(v[-1])
            else:
                currency.append('')
            
            values_numeric.append(v[0])
            base.append(v[1])
        else:
            values_numeric.append('')
            base.append('')
            currency.append('')
        
    df['values'] = [x.replace(',','') for x in values_numeric]
    df['base'] = [x.strip().lower() for x in base]
    df['base'] = df['base'].replace({'milion':'million'})
    df['currency'] = currency
    del df['value']
    df['values'] = pd.to_numeric(df['values'])
    df['values'] = [apply_base(v,b) for v,b in zip(df['values'],df['base'])]
    del df['base']
    df = df[~((df['Filing'] == 'Confid') & (df['variable'] != "ALL Limit"))]
    if sql:
        conn,engine = cer_connection()
        df.to_sql('Pipeline_Fin_Resource',if_exists='replace',index=False,con=conn)
        conn.close()
    return df


def tolls(name):
    
    def normalize(sheets,commodity,read_path):
        normal_list = []
        for sheet in sheets:
            try:
                df = pd.read_excel(read_path,sheet_name=sheet,skiprows=5)
                df = df[['Rate','Unit','Start','End']]
                df = df[df['Rate'].notnull()]
                if 'Current' in list(df['End']):
                    df['End'] = df['End'].replace('Current',date.today())
                df = normalize_dates(df, ['Start','End'])
        
                df['Rate'] = pd.to_numeric(df['Rate'])
                df['Pipeline'] = sheet.split('-')[-1].strip()
                df['Commodity'] = commodity
                df['Start'] = pd.to_datetime(df['Start'])
                df = df[df['Start'].dt.year>=2015]
                #normalize the tolls
                normalized = []
                toll_list = list(df['Rate'])
                for index,toll in enumerate(toll_list):
                    if index == 0:
                        normalized.append(toll/toll)
                    else:
                        #normalized.append(toll/toll_list[index-1]) #this is the old calculation
                        normalized.append(toll/toll_list[0])
                        
                df['Rate Normalized'] = normalized
                normal_list.append(df)
            except:
                raise
        
        #add in the gdp deflator for oil and gas tolls
        gdp = pd.read_excel(read_path,sheet_name='GDP Deflator',skiprows=26)
        gdp = gdp[['Start','End','Pipeline','Rate Normalized']]
        gdp = normalize_dates(gdp, ['Start','End'])
        gdp['Commodity'] = commodity
        normal_list.append(gdp)
        
        toll_list = pd.concat(normal_list, axis=0, sort=False, ignore_index=True)
        for delete in ['Rate','Unit']:
            del toll_list[delete]
        
        return toll_list
        
    read_path = os.path.join(os.getcwd(),'Data/',name)
    oil_sheets = ['Benchmark Toll - TNPI',
                  'Benchmark Toll - TMPL',
                  'Benchmark Toll - Keystone',
                  'Benchmark Toll - Express',
                  'Benchmark Toll - Enbridge ML']

    gas_sheets = ['Benchmark Toll - TC Mainline',
                  'Benchmark Toll - Westcoast',
                  'Benchmark Toll - TQM',
                  'Benchmark Toll - M&NP',
                  'Benchmark Toll - Alliance',
                  'Benchmark Toll - NGTL']
    
    oil = normalize(oil_sheets,'Crude Oil Breakdown',read_path)
    gas = normalize(gas_sheets,'Natural Gas Breakdown',read_path)
    
    #add in the commodity toll averages
    all_tolls = pd.read_excel(read_path,sheet_name='All Tolls')
    all_tolls['Commodity'] = 'Oil & Gas'
    all_tolls = normalize_dates(all_tolls,['Start','End'])
    
    df = pd.concat([oil,gas,all_tolls], axis=0, sort=False, ignore_index=True)
    df['Rate Normalized'] = df['Rate Normalized'].round(2)
    df['Pipeline'] = df['Pipeline'].replace({'Enbridge ML':'Enbridge Canadian Mainline',
                                             'Express':'Express Pipeline',
                                             'Keystone':'Keystone Pipeline',
                                             'TMPL':'Trans Mountain Pipeline',
                                             'TNPI':'Trans-Northern Pipeline',
                                             'Alliance':'Alliance Pipeline',
                                             'M&NP':'M&NP Pipeline',
                                             'NGTL':'NGTL System',
                                             'TC Mainline':'TC Canadian Mainline',
                                             'TQM':'TQM Pipeline',
                                             'Westcoast':'Enbridge BC Pipeline'})
    df = df.sort_values(by=['Commodity','Pipeline','Start','End'])
    df = normalize_dates(df, ['Start','End'])
    write_path = os.path.join(os.getcwd(),'../Cassandra/tolls/','tolls.json')
    saveJson(df, write_path)
    return df

def negotiated_settlements(name='2020_Pipeline_System_Report_-_Negotiated_Settlements_and_Toll_Indicies.XLSX'):
    read_path = os.path.join(os.getcwd(),'Data/',name)
    df = pd.read_excel(read_path,sheet_name='Settlements Data',skiprows=2)
    # df = df[df['Approved pursuant to the Negotiated Settlement Guidelines?'] == "Yes"]
    df = df[['Company', 'Group', 'Oil/Gas',
       'Settlement Name and/or Reference', 'Original Settlement Approval',
       'Start Date', 'End Date (specified, or effective)',
       'Toll Design, Revenue Requirment, or Both', 'Notes']]
    df = df[~df['Start Date'].isnull()]
    for delete in ['Original Settlement Approval','Toll Design, Revenue Requirment, or Both','Notes']:
        del df[delete]
    df = df.rename(columns={'Settlement Name and/or Reference':'Settlement Name',
                            'End Date (specified, or effective)':'End Date',
                            'Oil/Gas':'Commodity'})
    
    df['End Date'] = df['End Date'].replace('Not Fixed',np.nan)
    df = normalize_dates(df, ['Start Date','End Date'])
    df = df.sort_values(by=['Company','Start Date','End Date'])
    del df['Group']
    df['Company'] = df['Company'].replace(pipeline_names())
    df['Settlement Name'] = df['Settlement Name'].replace({np.nan:"Unnamed Settlement"})
    write_path = os.path.join(os.getcwd(),'../Cassandra/negotiated_settlements/','settlements.json')
    saveJson(df, write_path)
    return df

def creditRatings():
    df = readExcel('CreditTables.xlsx',sheet='ratings categories')
    scale = readExcel('CreditTables.xlsx',sheet='Scale')
    return df,scale

def st_stephen():
    df_traffic = readCersei('st_stephen.sql','st_stephen.json')
    df_traffic = df_traffic[~df_traffic['Imports'].isnull()]
    df_prod = readCersei('offshore_ns.sql','ns_offshore.json')
    for df in [df_traffic,df_prod]:
        df['Date'] = pd.to_datetime(df['Date'])
        df = df[df['Date'].dt.year >= 2009]
    max_traffic = max(df_traffic['Date'])
    max_prod = max(df_prod['Date'])
    date_col,value_col = [],[]
    while max_prod < max_traffic:
        max_prod = max_prod+relativedelta(months=1)
        date_col.append(max_prod)
        value_col.append(None)
    df_none = pd.DataFrame.from_dict({'Date':date_col,'Deep Panuke':value_col,'Sable Island':value_col})
    df_prod = pd.concat([df_prod,df_none], axis=0, sort=False, ignore_index=True)
    
    for output in [[df_traffic,'st_stephen.json'],[df_prod,'ns_offshore.json']]:
        df = output[0]
        df = df.sort_values(by=['Date'])
        df = normalize_dates(df, ['Date'])
        write_path = os.path.join(os.getcwd(),'Sara/st_stephen/',output[-1])
        saveJson(df, write_path)
    
    return df_traffic,df_prod


if __name__ == '__main__':
    print('Starting to json process...')        
    #kevin
    df = readExcel('Crude_Oil_Production.xlsx',sheet='pq')
    #df = readExcel('crude-oil-exports-by-destination-annual.xlsx',sheet='pq')
    #df = readExcel('UScrudeoilimports.xlsx',sheet='pq')
    #df = readCersei('ne2_WCS_eia_WTI.sql','oil_prices.json')
    
    #colette
    #df = readCersei('crude_by_rail_tidy.sql','crude_by_rail_wcs.json')
    #df = readExcel('figures.xlsx',sheet='Available for Export')
    #df = readCersei('crude_mode.sql','crude_mode.json')
    #df = readExcel('marine_exports.xlsx','marine exports')
    
    #sara
    #df = readCersei('gas_ex_wcsb_traffic.sql','gas_traffic.json')
    #df = readCersei('gas_2019_avg.sql','gas_2019.json')
    #dfmnp,dfoffshore = st_stephen()
    
    #rebecca
    #df = readCersei('platts_gas.sql','gas_prices.json')
    #df = readExcel('Natural_Gas_Production.xlsx')
    #df = readExcel('natural-gas-exports-and-imports-annual.xlsx','Gas Trade CER')
    
    #cassandra
    #df = readExcelPipeline('PipelineProfileTables.xlsx',sheet='Data')
    #df = tolls('2020_Pipeline_System_Report_-_Negotiated_Settlements_and_Toll_Indicies.XLSX')
    #df = negotiated_settlements()
    
    #ryan
    #df = readExcel('natural-gas-liquids-exports-monthly.xlsx')
    #df = readExcel('figures.xlsx',sheet='ngl production')
    
    #jennifer
    #df_fin_to_sql = financialResources(sql=True)
    #df_fin = readCersei('fin_resource_totals.sql','fin_resource_totals.json')
    #df_fin_class = readCersei('fin_resources_class.sql','fin_resource_class.json')
    #df_fin_class_names = readCersei('fin_resource_class_names.sql','fin_resource_class_names.json')
    #df,scale = creditRatings()
    #df = readExcel("abandonment funding data.xlsx","Modified",sql=True)

    #other
    #df = writeExcelCredit(name='CreditTables.xlsx',sql=True)
    print('Finished saving json data')
    
#%%