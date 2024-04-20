import { Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Box,
  Image,
} from '@chakra-ui/react';
import { AuthContext } from '../context/auth.context';
import { useContext } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

function Navbar() {
  const navigate = useNavigate();

  const { search, setSearch } = useContext(AuthContext);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);

  // --------------------------------------   handle Search button  ----------------------------

  const handleSearchSubmit = async e => {
    e.preventDefault();

    try {
      navigate(`/search/${search}`);
      handleSearchClose();
      setSearch('');
    } catch (error) {
      console.log('Error searching', error);
    }
  };

  return (
    <Flex
      as='nav'
      position='fixed'
      top={0}
      left={0}
      right={0}
      zIndex={999}
      bg='yellow.500'
      h='70px'
      p={4}
      justifyContent='space-between'
      alignItems='center'
      paddingLeft='2rem'
      paddingRight='2rem'
    >
      <ChakraLink as={ReactRouterLink} to={'/'}>
        <Flex>
          <Image
            src={'/logo.png'}
            fallbackSrc=''
            alt='Home'
            width='2rem'
            height='auto'
            marginRight='2rem'
            borderRadius='md'
          />
        </Flex>
      </ChakraLink>

      <Flex alignItems='center' justifyContent='space-evenly'>
        {/*  ---------------------------------------------------------  search Button  ----------------------------------------------- */}

        <Button
          onClick={handleSearchOpen}
          boxShadow='0px 2px 2px rgba(0, 0, 0, 0.5)'
          height='2rem'
          p='1.2rem'
          margin='1rem'
          _hover={{ bg: 'rgba(15, 22, 97, 1)', color: 'gray.100' }}
        >
          <IoSearchOutline size={20} />
        </Button>
        <Drawer
          placement='top'
          onClose={handleSearchClose}
          isOpen={isSearchOpen}
          size='xs'
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px' color='yellow.500'>
              Search by ticker symbol or crypto name
            </DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleSearchSubmit}>
                <label></label>
                <input
                  type='search'
                  name='search'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    padding: '0.3rem',
                    border: '1px solid rgba(15, 22, 97, 1)',
                    borderRadius: '0.3rem',
                    marginLeft: '1rem',
                    marginRight: '1rem',
                  }}
                />

                <button
                  type='submit'
                  style={{
                    backgroundColor: 'rgba(15, 22, 97, 1)',
                    color: 'white',
                    padding: '0.3rem',
                    borderRadius: '0.3rem',
                    borderColor: 'rgba(15, 22, 97, 1)',
                  }}
                >
                  Search
                </button>
              </form>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
}

export default Navbar;
