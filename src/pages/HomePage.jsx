import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Button,
  Image,
  Text,
} from '@chakra-ui/react';
import { Stat, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
const apiKey = `${import.meta.env.VITE_API_KEY}`;

function HomePage() {
  const [crypto, setCrypto] = useState([]);

  // -----------------------  get main crypto  -----------------------------------

  const getMainCrypto = async () => {
    try {
      const responseCr1 = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/BTCUSD?apikey=${apiKey}`
      );
      const responseCr2 = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/ETHUSD?apikey=${apiKey}`
      );
      const responseCr3 = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/BNBUSD?apikey=${apiKey}`
      );
      const responseCr4 = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/SOLUSD?apikey=${apiKey}`
      );
      const responseCr5 = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/DOGEUSD?apikey=${apiKey}`
      );

      console.log(responseCr1.data);
      setCrypto([
        responseCr1.data,
        responseCr2.data,
        responseCr3.data,
        responseCr4.data,
        responseCr5.data,
      ]);

      setInterval(getMainCrypto, 3600000); // call the function every hour
    } catch (error) {
      console.log(error);
      setTimeout(getMainCrypto, 60000); // in case of error, call it again in 1 min
    }
  };

  useEffect(() => {
    getMainCrypto();
  }, []);

  return (
    <>
      {crypto && (
        <Flex flexDirection='column' width='80vw'>
          {crypto.map(cryptoPair => {
            return (
              <Card
                key={cryptoPair[0].symbol}
                direction={{ base: 'column', sm: 'row' }}
                variant='outline'
                overflow='hidden'
                marginBottom='5%'
                MinHeight='min-content'
              >
                <Image
                  objectFit='cover'
                  width='200px'
                  height='200px'
                  src={`${cryptoPair[0].symbol}.png`}
                  alt={`${cryptoPair[0].name}`}
                  margin='5%'
                />

                <Stack border='1px solid black'>
                  <CardBody textAlign='left'>
                    <Flex flexDirection='column' height='100%'>
                      <Heading size='md' color='yellow.500'>
                        {cryptoPair[0].name}
                      </Heading>

                      <Stat>
                        <StatNumber fontSize='md' color='rgba(15, 22, 97, 0.9)'>
                          {cryptoPair[0].price}
                        </StatNumber>
                        <StatHelpText>
                          {cryptoPair[0].changesPercentage > 0 ? (
                            <>
                              <StatArrow type='increase' />
                              {(
                                Math.round(
                                  cryptoPair[0].changesPercentage * 100
                                ) / 100
                              ).toFixed(3)}
                              %
                            </>
                          ) : (
                            <>
                              <StatArrow type='decrease' />
                              {(
                                Math.round(
                                  cryptoPair[0].changesPercentage * 100
                                ) / 100
                              )
                                .toFixed(3)
                                .slice(1)}
                              %
                            </>
                          )}
                        </StatHelpText>
                      </Stat>
                    </Flex>
                  </CardBody>

                  <CardFooter>
                    <Button
                      variant='solid'
                      backgroundColor='rgba(15, 22, 97, 0.9)'
                      border='1px solid rgba(15, 22, 97, 0.9)'
                      color='white'
                      _hover={{
                        color: 'yellow.500',
                        backgroundColor: 'white',
                        borderColor: 'yellow.500',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}
                    >
                      See Historical Prices
                    </Button>
                  </CardFooter>
                </Stack>
              </Card>
            );
          })}
        </Flex>
      )}
    </>
  );
}

export default HomePage;
