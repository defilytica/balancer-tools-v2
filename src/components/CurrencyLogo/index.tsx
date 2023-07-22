import { useMemo } from 'react';
import { useActiveNetworkVersion } from "../../state/application/hooks";
import { useTheme } from '@mui/material/styles'
import {OptimismNetworkInfo, SupportedNetwork} from "../../constants/networks";
import { isAddress } from '../../utils';
import { Avatar } from '@mui/material';
import useGetTokenLists, {TokenList} from "../../data/balancer/useGetTokenList";
import {useLatestTokenList} from "../../data/tokens/useLatestTokenList";
import {tokenClient} from "../../apollo/client";


const getLogoURIByAddressAndChainId = (
    tokenList: TokenList | undefined,
    address: string,
): string  => {
    if (tokenList) {
        const foundToken = tokenList.tokens.find((token) => token.address === address);
        //VeBAL:
        //veBAL:
        if (address.toLowerCase() === '0xc128a9954e6c874ea3d62ce62b468ba073093f25') {
            return 'https://raw.githubusercontent.com/balancer/assets/master/assets/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56.png'
        }
        return foundToken?.logoURI ? foundToken?.logoURI : '';
    }
    return '';
};

export default function CurrencyLogo({address, size = '24px',}: {
    address?: string
    size?: string
}) {

    const [activeNetwork] = useActiveNetworkVersion();
    const theme = useTheme();
    const tokenList = useGetTokenLists();
    const optimismTokenList = useLatestTokenList(tokenClient, OptimismNetworkInfo.chainId)

    //Secondary assets are loaded through Balancer
    const tempSources: { [address: string]: string } = useMemo(() => {
        return {
            [`${address}`]:
                `https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/${address}.png`,
        }
    }, [address])

    //Token image sources
    const srcs: string[] = useMemo(() => {
        const checkSummed = isAddress(address)


        if (checkSummed && address) {
            const override = tempSources[address]
            return [getLogoURIByAddressAndChainId(tokenList, checkSummed), override]
        }
        return []
    }, [address, tempSources, tokenList])

    const newSrc = optimismTokenList.tokenList?.find(el => el.address === address);

    //Return an avatar for the default source, or an avatar as a child if default source is empty!
    return <Avatar
        sx={{
            height: size,
            width: size,
            backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'rgb(226, 232, 240)',
            color: theme.palette.mode === 'dark' ? 'white' : 'black',
            fontSize: '15px',
        }}
        src={srcs[1]}
        children={
            <Avatar
                sx={{
                    height: size,
                    width: size,
                    backgroundColor: theme.palette.mode === 'dark' ? 'white' : 'rgb(226, 232, 240)',
                    color: 'black',
                    fontSize: '15px',
                }}
                src={newSrc && newSrc.logoURI ? newSrc.logoURI : srcs[0]}
                alt={'?'}
            />
        }
        alt={'?'}
    />

}
