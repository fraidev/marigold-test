import React, { useState } from 'react';
import { TezosToolkit } from '@taquito/taquito';
import useInterval from '@use-it/interval';
import { Box, Button, Card, CardContent, Grid, LinearProgress, TextField, Typography } from '@material-ui/core';

const refreshRate = 30000

function TezosBalance() {
    let [balance, setBalance] = useState("0 ꜩ")
    let [isLoading, setIsLoading] = useState(false)
    let [rpc, setRPC] = useState("https://mainnet.api.tez.ie")
    let [address, setAddress] = useState("tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY")
    let [isValid, setIsValid] = useState(false)
    let [hasError, setHasError] = useState(false)

    const fetchBalance = (tezos: TezosToolkit, address: string) => {
        setIsLoading(true)
        tezos.tz.getBalance(address)
            .then((balance) => {
                setIsValid(true)
                setHasError(false)
                setBalance(`${balance.toNumber() / 1000000} ꜩ`)
            })
            .catch((error) => {
                setIsValid(false)
                setHasError(true)
                setBalance("0 ꜩ")
            }).finally(() => {
                setIsLoading(false)
            });
    }

    const fetchBalanceHandler = () => {
        const tezos = new TezosToolkit(rpc);
        fetchBalance(tezos, address)
    }

    useInterval(async () => {
        if (isValid && !hasError) {
            fetchBalanceHandler()
        }
    }, refreshRate);

    return (<Card sx={{ minWidth: 475 }}>
        <Box sx={{ background: '#1976D2' }} >
            <Typography sx={{ fontSize: '2rem', color: 'white' }} >
                Tezos Balance
            </Typography>
        </Box>

        <CardContent sx={{ padding: '0px 10px' }}>
            <Typography sx={{ fontSize: '1rem', color: '#E34035', visibility: hasError ? "visible" : "hidden" }}>
                Invalid rpc or tezos address
            </Typography>
            <Grid container spacing={2} >
                <Grid item xs={9}>
                    <Grid item xs={12} sx={{ paddingBottom: '10px' }}>
                        <TextField id="outlined-basic" label="RPC node http address" variant="outlined" sx={{ width: '100%' }}
                            size="small"
                            value={rpc}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRPC(e.target?.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchBalanceHandler()} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" label="Tezos address" variant="outlined" sx={{ width: '100%' }}
                            size="small"
                            value={address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target?.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchBalanceHandler()} />
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid item xs={12}>
                        <Button size="large" variant="outlined" sx={{ height: '88px' }} onClick={fetchBalanceHandler}>Show</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Typography sx={{ fontSize: '1.8rem' }}>{balance}</Typography>
        </CardContent>
        <LinearProgress sx={{ visibility: isLoading ? "visible" : "hidden" }} />
    </Card>)
}

export default TezosBalance;
