import React, { Component, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FiEdit, FiCheckCircle } from 'react-icons/fi';
import {
  Box,
  Spinner,
  Heading,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  IconButton,
  Checkbox,
  Radio,
  RadioGroup,
} from "@chakra-ui/core";
import userService from '../services/user.service';
import toastrService from '../services/toastr.service';

export default class extends Component {
  state = {
    users: [],
    loading: true,
  };

  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);

    this.loadUserList();
  }

  async loadUserList() {
    const users = await userService.get();

    this.setState({ users, loading: false });
  }

  async updateUser(userModel) {
    try {
      this.setState({ loading: true });

      await userService.update(userModel.id, userModel);

      const users = this.state.users.map(u => u.id === userModel.id ? userModel : u);

      this.setState({ users, loading: false });
    } catch(e) {
      if (e.messages) toastrService.error(e.messages);
      else toastrService.error('Unexpected error :c');

      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="40vh"
          width="100vw"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      );
    }

    return (
      <div>
        <Helmet>
          <title>{ this.state.loading ? 'Loading...' : 'User Management'} • 99wikis</title>
        </Helmet>

        <Box
          margin="0 auto"
          maxW="6xl"
          p={6}
          overflow="hidden"
        >
          <Breadcrumb
            spacing="8px"
            separator={<Icon color="gray.300" name="chevron-right" />}
            marginBottom={4}
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>User Management</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <Heading as="h1" size="xl" mb={6}>
              Manage Users
            </Heading>

            {this.state.users.map(user => (
              <UserItem user={user} updateUser={this.updateUser} />
            ))}
          </Box>
        </Box>
      </div>
    );
  }
};

const UserItem = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  const setRole = async (e) => {
    const userModel = { ...props.user };
    userModel.role = e.target.value;

    return props.updateUser(userModel);
  }

  const setApproved = (e) => {
    const userModel = { ...props.user };
    userModel.approved = e.target.checked;

    return props.updateUser(userModel);
  }

  if (isEditing) {
    return (
      <Box key={props.user.id}>
        <Box
          minHeight="50px"
          border="2px"
          backgroundColor="transparent"
          px={6}
          py={4}
          marginBottom={4}
          rounded={5}
          d="flex"
          alignItems="center"
        >
          <IconButton aria-label="Edit user" onClick={toggleEdit} icon={FiCheckCircle} />

          <Box ml={6}>
            <Heading as="h3" size="lg" mb={2}>
              {props.user.name} <small>({props.user.email})</small>
            </Heading>

            <Box
              d="flex"
              alignItems="center"
            >
              <RadioGroup onChange={setRole} value={props.user.role} isInline spacing={2}>
                <Radio value="admin">Admin</Radio>
                <Radio value="contributor">Contributor</Radio>
                <Radio value="reader">Reader</Radio>
              </RadioGroup>

              <Box ml={3}>-</Box>

              <Checkbox
                isChecked={props.user.approved}
                onChange={setApproved}
                ml={3}
              >
                Approved
              </Checkbox>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box key={props.user.id}>
      <Box
        minHeight="50px"
        border="2px"
        backgroundColor="transparent"
        px={6}
        py={4}
        marginBottom={4}
        rounded={5}
        d="flex"
        alignItems="center"
      >
        <IconButton aria-label="Edit user" onClick={toggleEdit} icon={FiEdit} />

        <Box ml={6}>
          <Heading as="h3" size="lg" mb={2}>
            {props.user.name} <small>({props.user.email})</small>
          </Heading>

          <Box
            d="flex"
            alignItems="center"
          >
            <Badge rounded="full" px="3" variantColor="blue" color="white">
              { props.user.role }
            </Badge>
            
            <Badge rounded="full" px="3" variantColor={ props.user.approved ? 'green' : 'red' } color="black" ml={2}>
              { props.user.approved ? 'Approved' : 'Blocked' }
            </Badge>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
