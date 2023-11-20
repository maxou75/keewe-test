import {useCallback, useEffect, useMemo, useState} from "react";
import Typography from "@mui/material/Typography";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {getCurrencies, postPayment} from "../../api";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CryptoJS from 'crypto-js';

export default function Payments() {
    const [currencies, setCurrencies] = useState({});
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [paidResults, setPaidResults] = useState([]);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpirationDate, setCardExpirationDate] = useState('');
    const [cardCryptogram, setCardCryptogram] = useState('');

    useEffect(() => {
        getCurrencies().then(({ data }) => {
            const currencies = Object.fromEntries(Object.entries(data).filter(([key]) => key.startsWith('EUR/')));
            setCurrencies(currencies)
        }).catch(e => {
            console.log('ERROR: ', e)
        });
    }, []);


    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        const card = { cardNumber, cardCryptogram, cardExpirationDate: new Date(cardExpirationDate) }
        const cardData = CryptoJS.AES.encrypt(JSON.stringify(card), 'secret_key').toString()
        postPayment({ amount, selectedCurrency, cardData }).then(({ data }) => {
            setPaidResults([data, ...paidResults])
            setAmount('')
            setSelectedCurrency('')
        }).catch(e => {
            console.log('ERROR: ', e)
        });
    }, [amount, selectedCurrency, paidResults, cardNumber, cardExpirationDate, cardCryptogram]);

    const isValid = useMemo(() => {
        return !!amount && !!selectedCurrency && !!cardNumber && !!cardExpirationDate && !!cardCryptogram
    }, [amount, selectedCurrency, cardNumber, cardExpirationDate, cardCryptogram])
    return (
        <section>
            <Typography component="h2"
                        variant="h4"
                        color="primary">
                Paiements
            </Typography>

            <Typography component="h3"
                        variant="h5"
                        marginTop={'40px'}
                        color="primary">
                Carte banquaire
            </Typography>
            <form onSubmit={handleSubmit}>

            <Stack direction="row" marginTop={'20px'} alignItems="center" spacing={3}>
                <TextField
                    sx={{ width: '300px'}}
                    type={'number'}
                    InputProps={{ inputProps: { min: 0 } }}
                    value={cardNumber}
                    error={cardNumber?.length !== 16}
                    label={
                        <Typography>
                            Numéro de la carte
                        </Typography>
                    }
                    onChange={(event) => {
                        setCardNumber(event.target.value)
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: '150px'}}
                        format={'MM/YY'}
                        views={['month', 'year']}
                        InputProps={{ inputProps: { min: 0 } }}
                        value={cardExpirationDate}
                        error={cardExpirationDate?.length !== 4}
                        label={
                            <Typography>
                                Date d'expiration
                            </Typography>
                        }
                        onChange={(value) => {
                            console.log(value)
                            setCardExpirationDate(value)
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    sx={{ width: '135px'}}
                    type={'number'}
                    InputProps={{ inputProps: { min: 0 } }}
                    value={cardCryptogram}
                    error={cardCryptogram?.length !== 3}
                    label={
                        <Typography>
                            Cryptogramme
                        </Typography>
                    }
                    onChange={(event) => {
                        setCardCryptogram(event.target.value)
                    }}
                />
            </Stack>
            <Stack direction="row" marginTop={'40px'} alignItems="center" spacing={3}>
                <TextField
                    type={'number'}
                    value={amount}
                    error={!amount}
                    label={
                        <Typography>
                            Montant à payer
                        </Typography>
                    }
                    InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: (
                            <span style={{marginLeft: '10px'}}>€</span>
                        ),
                    }}
                    onChange={(event) => { setAmount(event.target.value )}}
                />
                <Typography>pour la devise :</Typography>
                <FormControl style={{width: '100px'}}>
                    <InputLabel>Dev.</InputLabel>
                    <Select label="Age"
                            error={!selectedCurrency}
                            defaultValue={''}
                            value={selectedCurrency}
                            onChange={(event) => { setSelectedCurrency(event.target.value)}}>
                        {Object.entries(currencies).map(([key, ]) =>
                            (<MenuItem value={key} key={key}>{key.split('/')[1]}</MenuItem>)
                        )}
                    </Select>
                </FormControl>
            </Stack>
            <Button style={{marginTop: '30px'}} variant="contained" type={'submit'} disabled={!isValid}>Payer</Button>
            {paidResults?.length ?
                <Stack marginLeft={'10px'} marginTop={'40px'} spacing={2}>
                    {paidResults?.map((paidResult, key) =>
                        (<Typography key={key}>Vous avez payé {paidResult.paid.toFixed(2)} {paidResult.selectedCurrency?.split('/')[1]}.</Typography>)
                    )}
                </Stack> :
                null}
            </form>
        </section>
    )
}