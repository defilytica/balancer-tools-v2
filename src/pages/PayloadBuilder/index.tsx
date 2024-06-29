import React, {useState} from 'react';
import {
    Button,
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {AddCircleOutline, FileCopyOutlined, FileDownloadOutlined, RemoveCircleOutline} from '@mui/icons-material';
import {
    AddRewardInput,
    CCTPBridgeInput,
    generateCCTPBridgePayload,
    generateEnableGaugePayload,
    generateHumanReadableCCTPBridge,
    generateHumanReadableForEnableGauge,
    generateHumanReadableTokenTransfer,
    generateKillGaugePayload,
    generateTokenPaymentPayload,
    PaymentInput,
    generateHumanReadableAddReward,
    generateAddRewardPayload
} from "./helpers";
import ReactJson from "react-json-view";
import Box from "@mui/material/Box";

function DeleteIcon() {
    return null;
}

function PayloadBuilder() {
    const [option, setOption] = useState('');
    const [gaugeID, setGaugeID] = useState('');
    const [network, setNetwork] = useState('Ethereum');
    const [gauges, setGauges] = useState<{ id: string; network: string }[]>([{id: '', network: 'Ethereum'}]);
    const [usdcAmount, setUsdcAmount] = useState('');
    const [balAmount, setBalAmount] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
    const [humanReadableText, setHumanReadableText] = useState<string | null>(null);
    const [inputs, setInputs] = useState<CCTPBridgeInput[]>([{value: 0, destinationDomain: "3", mintRecipient: ''}]);

    const [to, setTo] = useState<string>('');
    const [value, setValue] = useState<number | string>('');
    const [token, setToken] = useState<'USDC' | 'BAL'>('USDC');
    const [payments, setPayments] = useState<PaymentInput[]>([]);

    const [rewardToken, setRewardToken] = useState<string>('');
    const [distributorAddress, setDistributorAddress] = useState<string>('');
    const [targetGauge, setTargetGauge] = useState<string>('');
    const [rewardAdds, setRewardAdds] = useState<AddRewardInput[]>([]);
    const [authorizerAdaptorEntrypoint, setEntrypoint] = useState<string>('');
    const [safeAddress, setSafeAddress] = useState<string>('');

    const NETWORK_OPTIONS = [
        {label: 'Ethereum', chainId: '1', maxiSafe:'0xc38c5f97B34E175FFd35407fc91a937300E33860', entrypoint:'0xf5dECDB1f3d1ee384908Fbe16D2F0348AE43a9eA'},
        {label: 'Arbitrum', chainId: '42161', maxiSafe:'0xc38c5f97B34E175FFd35407fc91a937300E33860', entrypoint:'0x97207B095e4D5C9a6e4cfbfcd2C3358E03B90c4A'},
        {label: 'Polygon', chainId: '137', maxiSafe:'0xc38c5f97B34E175FFd35407fc91a937300E33860', entrypoint:'0xAB093cd16e765b5B23D34030aaFaF026558e0A19'},
        {label: 'Polygon ZKEVM', chainId: '1101', maxiSafe:'0xB59Ab49CA8d064E645Bf2c546d9FE6d1d4147a09', entrypoint:'0xb9aD3466cdd42015cc05d4804DC68D562b6a2065'},
        {label: 'Optimism', chainId: '10', maxiSafe:'0x09Df1626110803C7b3b07085Ef1E053494155089', entrypoint:'0xed86ff0c507D3AF5F35d3523B77C17415FCfFaCb'},
        {label: 'Avalanche', chainId: '43114', maxiSafe:'0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6', entrypoint:'0x4E7bBd911cf1EFa442BC1b2e9Ea01ffE785412EC'},
        {label: 'Base', chainId: '8453', maxiSafe:'0x65226673F3D202E0f897C862590d7e1A992B2048', entrypoint:'0x9129E834e15eA19b6069e8f08a8EcFc13686B8dC'},
        {label: 'Gnosis', chainId: '100', maxiSafe:'0x14969B55a675d13a1700F71A37511bc22D90155a', entrypoint:'0x8F42aDBbA1B16EaAE3BB5754915E0D06059aDd75'},

    ];

    const DOMAIN_OPTIONS = [
        {label: 'Ethereum', value: '0'},
        {label: 'Avalanche', value: '1'},
        {label: 'Optimism', value: '2'},
        {label: 'Arbitrum', value: '3'},
        {label: 'Base', value: '6'},
        {label: 'Polygon PoS', value: '7'}
    ];

    const addressMapping: { [key: string]: string } = {
        '0': '0xc38c5f97B34E175FFd35407fc91a937300E33860', // Ethereum
        '1': '0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6', // Avalanche
        '2': '0x09Df1626110803C7b3b07085Ef1E053494155089', // Optimism
        '3': '0xc38c5f97B34E175FFd35407fc91a937300E33860', // Arbitrum
        '6': '0x65226673F3D202E0f897C862590d7e1A992B2048', // Base
        '7': '0xc38c5f97B34E175FFd35407fc91a937300E33860',  // Polygon
    };

    const handleAddPayment = () => {
        if (typeof value === 'number') {
            setPayments([...payments, {to, value, token}]);
            setTo('');
            setValue('');
            setToken('USDC');
        }
    };

    const handleRemovePayment = (index: number) => {
        const newPayments = [...payments];
        newPayments.splice(index, 1);
        setPayments(newPayments);
    };

    const generatePaymentPayload = () => {
        return generateTokenPaymentPayload(payments);
    };

    const generateHumanReadablePayment = () => {
        return payments.map(payment => {
            return generateHumanReadableTokenTransfer(payment);
        }).join('\n');
    };

    const handleInputChange = (index: number, field: string, value: string | number) => {
        const updatedInputs = [...inputs];
        (updatedInputs[index] as any)[field] = value;
        if (field === 'destinationDomain') {
            (updatedInputs[index] as any).mintRecipient = addressMapping[value as string] || '';
        }
        setInputs(updatedInputs);
    };

    const addInput = () => {
        setInputs([...inputs, {value: 0, destinationDomain: '0', mintRecipient: ''}]);
    };

    const handleRemoveInput = (index: number) => {
        const updatedInputs = [...inputs];
        updatedInputs.splice(index, 1);
        setInputs(updatedInputs);
    };

    const handleNetworkChange = (selectedNetwork: string) => {
      const selectedOption = NETWORK_OPTIONS.find(option => option.label === selectedNetwork);
      if (selectedOption) {
          setNetwork(selectedNetwork);
          setEntrypoint(selectedOption.entrypoint);
          setSafeAddress(selectedOption.maxiSafe);
      }
    };
    const handleRewardAdds = () => {
      if (typeof targetGauge === 'string') {
        setRewardAdds([...rewardAdds, {targetGauge, rewardToken, distributorAddress, safeAddress, authorizerAdaptorEntrypoint}]);
        setTargetGauge('');
        setRewardToken('');
        setDistributorAddress('');
        setSafeAddress('');
        setEntrypoint('');
      }
    }

    const handleRemoveReward = (index: number) => {
      const newRewards = [...rewardAdds];
      newRewards.splice(index, 1);
      setRewardAdds(newRewards);
  };

    const handleGenerateClick = () => {
        let payload;
        let text;

        switch (option) {
            case 'enable':
                payload = generateEnableGaugePayload(gauges.map(g => ({gauge: g.id, gaugeType: g.network})));
                text = generateHumanReadableForEnableGauge(gauges.map(g => ({gauge: g.id, gaugeType: g.network})));
                break;
            case 'kill':
                payload = generateKillGaugePayload(gauges.map(g => ({target: g.id})));
                text = '';  // As you've not provided a generateHumanReadableForKillGauge function.
                break;
            case 'tokenPayment':
                payload = generateTokenPaymentPayload(payments)
                text = payments.map(payment => {
                    return generateHumanReadableTokenTransfer(payment);
                }).join('\n');
                break;
            case 'CCTPBridge':
                payload = generateCCTPBridgePayload(inputs);
                text = generateHumanReadableCCTPBridge(inputs); // Call generateHumanReadableCCTPBridge with inputs
                break;
            case 'add_reward':
                payload = generateAddRewardPayload(rewardAdds);
                text = generateHumanReadableAddReward(rewardAdds);
                break;
            default:
                return;
        }

        setGeneratedPayload(JSON.stringify(payload, null, 4));  // Beautify JSON string
        setHumanReadableText(text);
    };

    const handleDownloadClick = () => {
        const payloadString = JSON.stringify(JSON.parse(generatedPayload), null, 2);
        const blob = new Blob([payloadString], {type: "application/json"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "BIP-XXX.json";
        link.click();
        URL.revokeObjectURL(link.href);
    };


    const copyJsonToClipboard = () => {
        const payloadString = JSON.stringify(JSON.parse(generatedPayload), null, 2);
        navigator.clipboard.writeText(payloadString).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    const copyTextToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
      <Container>
        <Typography variant="h5" style={{ marginBottom: "10px" }}>
          Balancer Maxi Payload Generator
        </Typography>
        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          {/* Option selector */}
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginBottom: "30px" }}
          >
            <InputLabel id="option-label">Option</InputLabel>
            <Select
              labelId="option-label"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              label="Option"
            >
              <MenuItem value="enable">Create Enable Gauge Payload</MenuItem>
              <MenuItem value="kill">Create Kill Gauge Payload</MenuItem>
              <MenuItem value="tokenPayment">Token Payment</MenuItem>
              <MenuItem value="CCTPBridge">CCTP Bridge</MenuItem>
              <MenuItem value="add_reward">Add Reward</MenuItem>
            </Select>
          </FormControl>
          <div style={{ marginBottom: "20px" }}>
            <Divider />
          </div>

          {(option === "enable" || option === "kill") && (
            <>
              {gauges.map((gauge, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth
                    label={`Gauge ID #${index + 1}`}
                    variant="outlined"
                    value={gauge.id}
                    onChange={(e) => {
                      const updatedGauges = [...gauges];
                      updatedGauges[index].id = e.target.value;
                      setGauges(updatedGauges);
                    }}
                    style={{ marginRight: "10px" }}
                  />

                  <FormControl
                    variant="outlined"
                    style={{ marginRight: "10px", width: "200px" }}
                  >
                    <InputLabel id={`network-label-${index}`}>
                      Network
                    </InputLabel>
                    <Select
                      labelId={`network-label-${index}`}
                      value={gauge.network}
                      onChange={(e) => {
                        const updatedGauges = [...gauges];
                        updatedGauges[index].network = e.target.value;
                        setGauges(updatedGauges);
                      }}
                      label="Network"
                    >
                      {NETWORK_OPTIONS.map((net) => (
                        <MenuItem key={net.label} value={net.label}>
                          {net.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <IconButton
                    onClick={() => {
                      const updatedGauges = [...gauges];
                      updatedGauges.splice(index, 1);
                      setGauges(updatedGauges);
                    }}
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  setGauges([...gauges, { id: "", network: "Ethereum" }])
                }
                startIcon={<AddCircleOutline />}
              >
                Add Gauge ID
              </Button>
            </>
          )}

          {option === "tokenPayment" && (
            <>
              {payments.map((payment, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth
                    label={`Recipient Address #${index + 1}`}
                    variant="outlined"
                    value={payment.to}
                    onChange={(e) => {
                      const updatedPayments = [...payments];
                      updatedPayments[index].to = e.target.value;
                      setPayments(updatedPayments);
                    }}
                    style={{ marginRight: "10px" }}
                  />

                  <TextField
                    label={`Amount #${index + 1}`}
                    variant="outlined"
                    value={payment.value}
                    onChange={(e) => {
                      const updatedPayments = [...payments];
                      updatedPayments[index].value = Number(e.target.value);
                      setPayments(updatedPayments);
                    }}
                    style={{ marginRight: "10px" }}
                  />

                  <FormControl
                    variant="outlined"
                    style={{ marginRight: "10px", width: "120px" }}
                  >
                    <InputLabel>Token</InputLabel>
                    <Select
                      value={payment.token}
                      onChange={(e) => {
                        const updatedPayments = [...payments];
                        updatedPayments[index].token = e.target.value as
                          | "USDC"
                          | "BAL";
                        setPayments(updatedPayments);
                      }}
                    >
                      <MenuItem value="USDC">USDC</MenuItem>
                      <MenuItem value="BAL">BAL</MenuItem>
                    </Select>
                  </FormControl>

                  <IconButton onClick={() => handleRemovePayment(index)}>
                    <RemoveCircleOutline />
                  </IconButton>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() =>
                  setPayments([
                    ...payments,
                    { to: "", value: 0, token: "USDC" },
                  ])
                }
                startIcon={<AddCircleOutline />}
              >
                Add Payment
              </Button>
            </>
          )}

          {option === "CCTPBridge" && (
            <>
              {inputs.map((input, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    style={{ marginRight: "10px", width: "200px" }}
                  >
                    <InputLabel>Token</InputLabel>
                    <Select value="USDC" label="Token" disabled>
                      <MenuItem value="USDC">USDC</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label={`Amount #${index + 1}`}
                    variant="outlined"
                    value={input.value}
                    onChange={(e) =>
                      handleInputChange(index, "value", Number(e.target.value))
                    }
                    style={{ marginRight: "10px" }}
                  />

                  <FormControl
                    variant="outlined"
                    style={{ marginRight: "10px", width: "200px" }}
                  >
                    <InputLabel>Destination Domain</InputLabel>
                    <Select
                      value={input.destinationDomain}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "destinationDomain",
                          e.target.value
                        )
                      }
                      label="Destination Domain"
                    >
                      {DOMAIN_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label={`Mint Recipient #${index + 1}`}
                    variant="outlined"
                    value={input.mintRecipient}
                    onChange={(e) =>
                      handleInputChange(index, "mintRecipient", e.target.value)
                    }
                    style={{ marginRight: "10px", width: "420px" }} // Adjusted width here
                  />

                  <IconButton onClick={() => handleRemoveInput(index)}>
                    <RemoveCircleOutline />
                  </IconButton>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={addInput}
                startIcon={<AddCircleOutline />}
              >
                Add Input
              </Button>
            </>
          )}

          {option === "add_reward" && (
            <>
              <FormControl
                fullWidth
                variant="outlined"
                style={{ marginBottom: "30px" }}
              >
                <InputLabel id="network-label">Network</InputLabel>
                <Select
                  labelId="label"
                  value={network}
                  onChange={(e) =>
                    handleNetworkChange(e.target.value as string)
                  }
                  label="Network"
                >
                  {NETWORK_OPTIONS.map((option) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Target Gauge"
                  value={targetGauge}
                  onChange={(e) => setTargetGauge(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Reward Token"
                  value={rewardToken}
                  onChange={(e) => setRewardToken(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Distributor Address"
                  value={distributorAddress}
                  onChange={(e) => setDistributorAddress(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  onClick={handleRewardAdds}
                  startIcon={<AddCircleOutline />}
                >
                  Add Reward
                </Button>
              </Grid>
              {rewardAdds.map((reward, index) => (
            <Paper key={index} style={{ padding: "10px", marginTop: "10px" }}>
                <Typography variant="subtitle1">
                    Reward {index + 1}
                </Typography>
                <Typography>
                    Target Gauge: {reward.targetGauge}<br />
                    Reward Token: {reward.rewardToken}<br />
                    Distributor Address: {reward.distributorAddress}<br />
                    Safe Address: {reward.safeAddress}<br />
                    Authorizer/Adaptor Entrypoint: {reward.authorizerAdaptorEntrypoint}
                </Typography>
                <IconButton
                    onClick={() => handleRemoveReward(index)}
                    style={{ marginLeft: "10px" }}
                >
                    <RemoveCircleOutline />
                </IconButton>
            </Paper>
        ))}
            </>
          )}

          <div style={{ marginTop: "20px" }}>
            <Button
              variant="outlined"
              style={{ marginBottom: "10px" }}
              onClick={handleGenerateClick}
            >
              Generate Payload
            </Button>
          </div>
          <Divider />

          {generatedPayload && (
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h6" style={{ marginBottom: "10px" }}>
                Generated JSON Payload:
              </Typography>
              <ReactJson
                theme={"solarized"}
                src={JSON.parse(generatedPayload)}
              />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadOutlined />}
              style={{ marginRight: "10px" }}
              onClick={handleDownloadClick}
            >
              Download Payload
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileCopyOutlined />}
              onClick={copyJsonToClipboard}
            >
              Copy to Clipboard
            </Button>
          </div>

          {humanReadableText && (
            <div style={{ marginTop: "20px" }}>
              <Typography variant="h5">Human-readable Text</Typography>
              <Paper style={{ padding: "20px", marginBottom: "20px" }}>
                <Typography>{humanReadableText}</Typography>
              </Paper>
              <Button
                variant="contained"
                color="primary"
                onClick={() => copyTextToClipboard(humanReadableText)}
              >
                Copy to Clipboard
              </Button>
            </div>
          )}
        </Paper>
        <Grid>
          <Box mt={8}></Box>
        </Grid>
      </Container>
    );
}

export default PayloadBuilder