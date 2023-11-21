import {TextField} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Amount({amount, setAmount, label, withAdornment = true}) {

    return (
        <TextField
            value={amount}
            error={!amount}
            label={
                <Typography>
                    {label}
                </Typography>
            }
            InputProps={{
                endAdornment: withAdornment ? (
                    <span style={{marginLeft: '10px'}}>€</span>
                ) : null,
            }}
            onChange={(event) => {
                const value = event.target.value?.replace(',', '.');
                if (!isNaN(value) && (!value?.trim()?.length || parseFloat(value) > 0)) setAmount(value);
            }}
        />
    )
}