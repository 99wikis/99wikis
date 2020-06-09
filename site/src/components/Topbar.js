import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  Image,
  Heading,
} from "@chakra-ui/core";
import { FiMenu } from 'react-icons/fi';

export default (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const logout = async () => {
    localStorage.clear();
    props.history.push('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  if (!props.sessionUser) return null;

  return (
    <Box
      px={6}
      py={3}
      d="flex"
      justifyContent="space-between"
    >
      <IconButton
        variantColor="blue"
        aria-label="Menu"
        icon={FiMenu}
        fontSize="22px"
        onClick={toggleMenu}
      />

      <Drawer placement="left" onClose={toggleMenu} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Image src="/images/logo.png" maxWidth="150px" width="80%" />
          </DrawerHeader>
          <DrawerBody>
            <Heading size="lg" as="h4" mb={3}>Hi {props.sessionUser.name}</Heading>
            <p my={1}><Link to="/">Go to dashboard</Link></p>
            { props.sessionUser.role === 'admin' && (<p my={1}><Link to="/users">Manage users</Link></p>) }
            <p my={1}><Link onClick={logout}>Logout</Link></p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
