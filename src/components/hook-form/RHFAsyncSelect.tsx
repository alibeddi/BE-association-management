import { Tooltip } from '@mui/material';
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { AsyncPaginate } from 'react-select-async-paginate';
import { useLocales } from '../../locales';
import { isObjectEmpty } from '../../utils';
import { Params, setParams } from '../../utils/setParams';
import { StyledAsyncPaginate } from '../AsyncSelect/styles';

interface Props<T>  {
  name: string;
  label: string;
  helperText?:React.ReactNode;
  required?: boolean;
  isMulti?: boolean;
  disable?:boolean;
  isSearchable?:boolean;
  placeholder?:string;
  value?: T;
  fetchData: (params:Params) => Promise<any>
  getOptionLabel: (option: T) => string;
 getOptionValue: (option: T) => any;
 onChange?: Function;
 sx?: React.CSSProperties;
}

const RHFAsyncSelect = <T,>({
  name,
  label,
  helperText,
  isMulti=false,
  disable=false,
  required=false,
  fetchData,
  placeholder,
  isSearchable=true,
  getOptionLabel,
  getOptionValue,
  sx={},
  value,
  onChange:onChangeProp,
  ...other
}:Props<T>) => {
  const {control} = useFormContext()
  const {translate} = useLocales()
  const [page,setPage] = useState<number>(1)
  const [filterName,setFilterName] = useState<string | null>(null)
  const loadOptions = async (searchQuery: string) => {
   
    if(searchQuery){
      setFilterName(searchQuery)
      setPage(1)
    } 
    const params = setParams({page,limit:10,name:searchQuery || ""})
    const data = await  fetchData(params)
    const {docs,meta} = data.data;
    const hasMore = meta.hasMore;
    setPage(prev => hasMore ?  prev + 1 : page);
    return {
      options: docs,
      hasMore,
      additional: {
        page
      }
    };
  };
 
  return (
    <Controller
    name={name}
    control={control}
    render={({field,fieldState:{error}})=>(
      
        <AsyncPaginate
         onChange={(e) => {
          if(!e) return;
          if(onChangeProp){
            onChangeProp(e)
          }else{
            field.onChange((e));
          }
          
        }}
        className="test__select"
        value={value}
        // value={isObjectEmpty(field.value) ? [] : field.value}
        isMulti={isMulti}
        additional={{
          page:1
        }}
        isDisabled={disable}
        loadOptions={loadOptions}
        getOptionLabel={(option:T)=>getOptionLabel(option)}
        getOptionValue={(option:T)=>getOptionValue(option)}
        isSearchable={isSearchable}
        placeholder={placeholder || "select item"}
        required={required}
        styles={StyledAsyncPaginate(sx)}
        {...other}
      />
      
    )}
    />
  )
}

export default RHFAsyncSelect
