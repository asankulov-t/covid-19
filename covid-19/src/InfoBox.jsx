import React from 'react';
import Card from "@material-ui/core/Card/Card";
import Typography from "@material-ui/core/Typography/Typography";
import CardContent from "@material-ui/core/CardContent/CardContent";
import './InfoBox.css'
const InfoBox = ({title,isRed, active, cases, total, onClick}) => {
    return (
        <Card onClick={onClick} className={`infoBox ${active && "infobox--selected"} ${isRed && "infobox--red"} `}>
            <CardContent>
                <Typography className='infoBox__title' color='textSecondary'>
                    {title}
                </Typography>
                <h3 className={`infoBox__cases ${!isRed && 'infobox--cases--green'}`}>{cases}</h3>
                <Typography className='infoBox__title' color='textSecondary'>
                    {total} total
                </Typography>
            </CardContent>

        </Card>
    );
};

export default InfoBox;