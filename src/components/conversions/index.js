import {useCallback, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {getConversion, getCurrencies} from "../../api";

export default function Conversions() {
    const [currenciesLabel, setCurrenciesLabel] = useState({});
    const [amount, setAmount] = useState('');
    const [selectedCurrency1, setSelectedCurrency1] = useState('');
    const [selectedCurrency2, setSelectedCurrency2] = useState('');
    const [conversionsResults, setConversionsResults] = useState([]);

    useEffect(() => {
        getCurrencies().then(({ data }) => {
            const currenciesLabel = [...new Set(Object.entries(data).map(([key,]) => (key.split('/')[0])))]
            setCurrenciesLabel(currenciesLabel)
        }).catch(e => {
            console.log('ERROR: ', e)
        });
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        const selectedCurrency = `${selectedCurrency1}/${selectedCurrency2}`
        getConversion({ amount: parseFloat(amount), selectedCurrency}).then(({data}) => {
            setConversionsResults([data, ...conversionsResults])
            setAmount('')
            setSelectedCurrency1('')
            setSelectedCurrency2('')
        }).catch(e => {
            console.log('ERROR: ', e)
        })
    }, [amount, selectedCurrency1, selectedCurrency2, conversionsResults]);

    useEffect(() => {
        if (selectedCurrency1 === selectedCurrency2) setSelectedCurrency2('')
    }, [selectedCurrency1, selectedCurrency2, setSelectedCurrency2])

    return (
        <section>
            <Typography component="h2"
                        variant="h4"
                        color="primary">
                Conversions de devises
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack direction="row" marginTop={'40px'} alignItems="center" spacing={3}>
                    <TextField
                        value={amount}
                        label={
                            <Typography>
                                Montant à convertir
                            </Typography>
                        }
                        onChange={(event) => {
                            const value = event.target.value?.replace(',', '.');
                            if (!isNaN(value) && (!value?.trim()?.length || parseFloat(value) > 0)) setAmount(value);
                        }}
                    />
                    <Typography>en devise :</Typography>
                    <FormControl style={{width: '100px'}}>
                        <InputLabel>Dev.</InputLabel>
                        <Select label="Age"
                                defaultValue={''}
                                value={selectedCurrency1}
                                onChange={(event) => { setSelectedCurrency1(event.target.value)}}>
                            {Object.entries(currenciesLabel).map(([key, value]) =>
                                (<MenuItem value={value} key={key}>{value}</MenuItem>)
                            )}
                        </Select>
                    </FormControl>
                    <Typography>pour la devise :</Typography>
                    <FormControl style={{width: '100px'}}>
                        <InputLabel>Dev.</InputLabel>
                        <Select disabled={!selectedCurrency1}
                                label="Age"
                                defaultValue={''}
                                value={selectedCurrency2}
                                onChange={(event) => { setSelectedCurrency2(event.target.value)}}>
                            {Object.entries(currenciesLabel).filter(([, value]) => (value !== selectedCurrency1 )).map(([key, value]) =>
                                (<MenuItem value={value} key={key}>{value}</MenuItem>)
                            )}
                        </Select>
                    </FormControl>
                </Stack>
                <Button style={{marginTop: '30px'}} variant="contained" type={'submit'} disabled={!selectedCurrency1 || !selectedCurrency2 || !amount}>Convertier</Button>
                {conversionsResults?.length ?
                    <Stack marginLeft={'10px'} marginTop={'40px'} spacing={2}>
                        {conversionsResults?.map((r, key) =>
                            (<Typography key={key}>Le montant {parseFloat(r.amount)?.toFixed(2).replace('.', ',')} {r.selectedCurrency?.split('/')[0]} convertis est de {parseFloat(r.convertedAmount)?.toFixed(2).replace('.', ',')} {r.selectedCurrency?.split('/')[1]}.</Typography>)
                        )}
                    </Stack> :
                    null}
            </form>
        </section>
    )
}