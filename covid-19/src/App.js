import './App.css';

import {useEffect, useState} from "react";
import InfoBox from "./InfoBox";
import Card from "@material-ui/core/Card/Card";
import Table from "./Table";
import CardContent from "@material-ui/core/CardContent/CardContent";
import {prettyPrintStat, sortDate} from "./util";
import LineGraph from "./LineGraph";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Map from "./Map";
import "leaflet/dist/leaflet.css"

function App() {

    const [country, setCountry]=useState('Worldwide')
    const [countries, setCountries]=useState([]);
    const [countryInfo, setCountryInfo]=useState([])
    const [tableData,setTableDate]=useState([])
    const [casesType, setCasesType] = useState("cases");
    const [mapCenter, setMapCenter]=useState({lat:34.80764, lng:-40.4796});
    const [mapZoom,setMapZoom]=useState(3)
    const [mapCountries, setMapCountries]=useState([])

    useEffect( ()=>{
        fetch('https://disease.sh/v3/covid-19/all').then(res=>res.json()).then((data)=>{
            setCountryInfo(data)
        })
    },[])

    useEffect(()=>{
        const getCountries=async()=>{
            fetch('https://disease.sh/v3/covid-19/countries').then((response)=>response.json())
                .then((data)=>{
                    const countries=data.map((country)=>(
                        {
                            name:country.country,
                            value:country.countryInfo.iso2
                        }
                    ));
                    const sortedData=sortDate(data)
                    setTableDate(sortedData)
                    setMapCountries(data)
                    setCountries(countries)
                    console.log(countries)
                })
        }
                getCountries()
    },[])

    //https://disease.sh/v3/covid-19/countries


    const onChangeCountry=async (event)=>{
        const countryCode=event.target.value;
        const url=countryCode==='Worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url).then(response=>response.json()).then(data=>{
            setCountry(countryCode)
            setCountryInfo(data)
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setMapZoom(4)
        })
    }

  return (
    <div className="App">
        <div className="app__left">
            <div className="app__header">
                <h1>COVID-19 TRACKER</h1>
                <FormControl>
                    <Select variant = "outlined" onChange={onChangeCountry} value={country}>
                        <MenuItem value='Worldwide'>Worldwide</MenuItem>
                        {countries.map((country)=>(
                            <MenuItem value={country.value}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div className="app__stats">
                <InfoBox isRed active={casesType==='cases'} onClick={(e)=>setCasesType('cases')} title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
                <InfoBox active={casesType==='recovered'} onClick={(e)=>setCasesType("recovered")} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
                <InfoBox isRed active={casesType==='deaths'} onClick={(e)=>setCasesType("deaths")}title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
            </div>
            <Map casesType={casesType} center={mapCenter}  zoom={mapZoom} countries={mapCountries}/>
            {/* {Map} */}
        </div>
        <Card className="app__right">
            <CardContent>
                <h3>Live Cases by Country</h3>
                <Table countries={tableData}/>
                <h3>Worldwide new {casesType}</h3>
                <LineGraph casesType={casesType}/>
            </CardContent>

            {/* {Graph} */}
        </Card>
    </div>
  );
}

export default App;
