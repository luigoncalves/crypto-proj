import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import axios from 'axios';
import { Flex, Heading, Button } from '@chakra-ui/react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react';

const apiKey = `${import.meta.env.VITE_API_KEY}`;

function Search() {
  const [searchItems, setSearchItems] = useState([]);
  const [itemsToShow, setItemsToShow] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(0);
  const [resultsLength, setResultsLength] = useState(0);

  const { field } = useParams();

  const getSearchResults = async inputField => {
    try {
      const searchResponse = await axios.get(
        `https://financialmodelingprep.com/api/v3/search?query=${inputField}&exchange=CRYPTO&apikey=${apiKey}`
      );

      setSearchItems(searchResponse.data);
      setResultsLength(searchResponse.data.length);
      setDisplayedItems(0);
    } catch (error) {
      console.log(error);
    }
  };

  const getMoreInfo = async () => {
    try {
      const itemsToProcess = searchItems.slice(
        displayedItems,
        displayedItems + 10
      );
      const promises = itemsToProcess.map(async item => {
        if (item.exchangeShortName === 'CRYPTO') {
          const response = await axios.get(
            `https://financialmodelingprep.com/api/v3/quote/${item.symbol}?apikey=${apiKey}`
          );

          if (!response || !response.data || response.data.length === 0) {
            return item;
          }

          const cryptoInfo = response.data[0];

          item.price = cryptoInfo.price;
          item.changesPercentage = cryptoInfo.changesPercentage;
          item.change = cryptoInfo.change;
          item.route = 'crypto';

          return item;
        }
      });

      const updatedItems = await Promise.all(promises);

      setItemsToShow([...itemsToShow, ...updatedItems]);
      setDisplayedItems(displayedItems + 10);
    } catch (error) {
      console.log(error);
    }
  };

  // --------- run everytime the search field changes

  useEffect(() => {
    setItemsToShow([]);
    getSearchResults(field);
    console.log(itemsToShow);
  }, [field]);

  // --------- run everytime the searchItems array is changed

  useEffect(() => {
    if (searchItems.length !== 0) {
      getMoreInfo();
    }
  }, [searchItems]);

  return (
    <Flex
      flexDirection='column'
      justifyContent='start'
      alignContent='center'
      width='80vw'
      height='auto'
      padding='20px'
    >
      <Heading margin='2.5rem' textAlign='left' color='rgba(15, 22, 97, 1)'>
        Found {resultsLength} results for '{field}'
      </Heading>

      <Flex flexDirection='column'>
        {resultsLength === 0
          ? null
          : itemsToShow.map((item, index) => {
              return (
                <ChakraLink
                  as={ReactRouterLink}
                  to='/'
                  key={index}
                  marginBottom='4px'
                >
                  <Card marginBottom='2px'>
                    <CardBody>
                      <Flex justifyContent='space-between'>
                        <Heading size='sm' color='yellow.500' textAlign='left'>
                          {item.symbol}
                        </Heading>
                        <Heading fontSize='md' color='rgba(15, 22, 97, 0.9)'>
                          {(Math.round(item.price * 100) / 100).toFixed(3)}
                        </Heading>
                      </Flex>
                      <Flex justifyContent='space-between'>
                        <Text fontSize='xs'>{item.name}</Text>

                        <Stat textAlign='right'>
                          <StatHelpText>
                            {item.change > 0 ? (
                              <>
                                <StatArrow type='increase' />
                                {(
                                  Math.round(item.changesPercentage * 100) / 100
                                ).toFixed(3)}
                                %
                              </>
                            ) : (
                              <>
                                <StatArrow type='decrease' />
                                {(
                                  Math.round(item.changesPercentage * 100) / 100
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
                  </Card>
                </ChakraLink>
              );
            })}
      </Flex>

      {resultsLength > displayedItems && resultsLength !== 0 && (
        <Flex
          marginLeft='2.5rem'
          marginRight='2.5rem'
          marginBottom='2.5rem'
          alignItems='center'
          justifyContent='center'
        >
          <Button
            mt={2}
            color='gray.100'
            width='max-content'
            border='1px solid yellow.500'
            bg='yellow.500'
            _hover={{
              bg: 'white',
              color: 'yellow.500',
              borderColor: 'yellow.500',
            }}
            onClick={getMoreInfo}
          >
            See More
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

export default Search;
