import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Alert, Box, Button, Card, CardContent, Divider, LinearProgress, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import dataConfig from '../data/templateConfig.json';

import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AvlDate from './AvlDate';
import dayjs, { Dayjs } from 'dayjs';




export interface ICardData {
    count: string;
    deptId: string;
    startTime: string;
    endTime: string;
}

export interface IAvl {
    avlTrackId: string;
    xCoord: string;
    yCoord: string;
    latitude: string;
    longitude: string;
    speed: string;
    heading: string;
    altitude: string;
    avlDatetime: string;
    inputs: string;
    floorLvl: string;
    extraData: string;
}


export default function Templates() {
    const [temp, setTemp] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const [data, setData] = React.useState<IAvl[]>([]);
    const [cardData, setCardData] = React.useState<ICardData>({ count: '', deptId: '', startTime: '00:00', endTime: '00:00' })
    const [avltrackId, setAvltrackId] = React.useState<string>('');

    const [url, setUrl] = React.useState<string>('http://localhost:8080/NJM/rest/avl');
    const [dateValue, setDateValue] = React.useState<any>(dayjs());
    const [isRuning, setIsRuning] = React.useState(false);
    const [isfinished, setIsFinished] = React.useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setTemp(event.target.value);
    };

    React.useEffect(() => {
        //console.log(dateValue);
    }, [dateValue])

    React.useEffect(() => {

        if (data.length > 0) {
            const starttime: string = data[0].avlDatetime;
            const splittedStart = starttime.split(" ", 2);
            const endTime: string = data[data.length - 1].avlDatetime;
            const splittedend = endTime.split(" ", 2);
            const filtered: any = dataConfig.templates.filter(a => a.id === temp);
           
            setCardData({ count: data.length.toString(), deptId: filtered[0].deptName, startTime: splittedStart[1], endTime: splittedend[1] });
        }
    }, [data, temp]);

    const setDate = (data: React.SetStateAction<dayjs.Dayjs | null>) => {
        setDateValue(data)
    }

    const handleRun = async (e: any) => {

        setIsRuning(true);


        for (let index =0; index < data.length ; index++){
            var clone = { ...data[index]};
           
            clone.avlDatetime = dateValue.format("DD/MM/YYYY")  + " "+ data[index].avlDatetime.split(" ", 2)[1];
            
            clone.avlTrackId = avltrackId;
            
          

            const response = await fetch(url + '/add', { method: 'POST', headers: { 'Content-Type': 'application/json' },body:JSON.stringify(clone)});
        
            setIsFinished(index === data.length - 1)
           
        }

       
    };

    const handleBack = () => {
        setIsRuning(false);
        setIsFinished(true);
    };

    const handleSubmit = (e: any) => {
        if (temp !== '') {
            setLoading(true);
            setError(false);
            // get data Template
            fetch('../data/' + temp + '.json', { headers: { 'Content-Type': 'application/json' }, })
                .then(response => {
                    return response.json();
                }).then(data => {
                    setData(data);
                    setLoading(false);
                    // console.log(data);
                }).catch((e: Error) => {
                    console.error(e.message);
                });

        }
        else {
            setError(true);
            setLoading(false);
        }

    };

    return (
        <Box>
            {!isRuning ? (
                <Box>
                    <Box >
                        <FormControl variant='standard' sx={{ m: 0.5 }} >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                marginTop: '20px',
                                marginBottom: '20px',
                                marginLeft: '20px',
                            }}>

                                <InputLabel id="demo-simple-select-label" sx={{ m: 0.5 }}>List of Template *</InputLabel>
                                <Select variant="standard" sx={{ minWidth: 300, maxWidth: 500, m: 0.5 }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={temp}
                                    label="Template"
                                    onChange={handleChange}
                                    required
                                    error={error}>

                                    {dataConfig.templates.map((template) => {
                                        return <MenuItem key={template.id} value={template.id}>{template.name}</MenuItem>
                                    })}

                                </Select>


                                <LoadingButton variant='contained' sx={{ m: 0.5, minWidth: 100 }} onClick={handleSubmit}
                                    loadingPosition="start"
                                    loading={loading}
                                    startIcon={<DownloadIcon />}

                                >
                                    Load
                                </LoadingButton>
                            </div>
                        </FormControl>
                    </Box>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginTop: '20px',
                        marginBottom: '20px',
                        marginLeft: '20px',
                        justifyContent: 'center',
                    }}>
                        <Card sx={{ minWidth: 300, maxWidth: 500, m: 0.5 }} >
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    Template Details
                                </Typography>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Rows Count :
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {data.length}
                                </Typography>
                                <Divider variant="middle" />
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Department :
                                </Typography>
                                <Typography variant="h5" component="div" sx={{ minHeight: 32 }}>
                                    {cardData.deptId}
                                </Typography>
                                <Divider variant="middle" />
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Start Time :
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {cardData.startTime}
                                </Typography>
                                <Divider variant="middle" />
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    End Time :
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {cardData.endTime}
                                </Typography>

                            </CardContent>
                            {loading
                                ? <LinearProgress color="success" variant='indeterminate' />
                                : <Box sx={{ height: 4 }} />
                            }

                        </Card>
                    </div>
                    <Divider variant="middle"></Divider>

                    
                    <FormControl variant='standard' >
                        <TextField label="Backend Url"
                            sx={{ m: 0.5, minWidth: 500 }}
                            hiddenLabel
                            id="url-hidden-label-small"
                           
                            variant="standard"
                            required
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            error={url === ""}
                            helperText={url === "" ? 'Empty field!' : ' '}
                            type='url'
                        />
                        <TextField label="AVL TRACK ID"
                            sx={{ m: 0.5, marginBottom: 2, minWidth: 200, maxWidth: 200 }}
                            hiddenLabel
                            id="avl-hidden-label-small"
                            variant="standard"
                            value={avltrackId}
                            onChange={e => setAvltrackId(e.target.value)}
                            required
                            error={avltrackId === ""}
                            helperText={avltrackId === "" ? 'Empty field!' : ' '}
                            type='text'
                        />

                        <AvlDate setDate={setDate} />

                        <LoadingButton variant='contained'
                            sx={{ m: 0.5, minWidth: 100, maxWidth: 200 }}
                            onClick={handleRun} disabled={data.length <= 0 || avltrackId === "" || url === ""}>
                            Run
                        </LoadingButton>

                        {/* </div> */}
                    </FormControl >
                </Box>
            ) : (
                <>
                    {!isfinished && <LinearProgress variant='indeterminate' />}
                    {isfinished && <Alert severity="success">This is a success alert — check it out!</Alert>}
                    {isfinished &&
                        <Button variant="contained" startIcon={<ArrowBackIosIcon />} onClick={handleBack}>
                            Back
                        </Button>}
                </>
            )}

        </Box>


    );
}

