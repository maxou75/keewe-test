import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";
import {getPayments} from "../../api";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export default function Historic() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        getPayments().then(({ data }) => {
            console.log('data : ', data)
            setTransactions(data)
        }).catch(e => {
            console.log('ERROR: ', e)
        });
    }, []);

    return (
        <section>
            <Typography component="h2"
                        variant="h4"
                        color="primary">
                Historique des transactions
            </Typography>
            {transactions?.length > 0 ?
                <TableContainer style={{ marginTop: '40px'}} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Montant</TableCell>
                                <TableCell align="right">Devise</TableCell>
                                <TableCell align="right">Statut</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map(t => (
                                <TableRow
                                    key={t.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {new Date(t.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">{parseFloat(t.paid)?.toFixed(2)}</TableCell>
                                    <TableCell align="right">{t.currency.split('/')[1]}</TableCell>
                                    <TableCell align="right">{t.status === 'valid' ? 'Validé' : 'Refusé'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> :
            null}
        </section>
    )
}