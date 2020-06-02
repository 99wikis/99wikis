import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Formik, Field } from 'formik';
import theme from '../theme';
import { IoMdPerson } from "react-icons/io";
import {
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Icon,
  Stack,
  SimpleGrid,
  Box,
  Heading,
  Button,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/core";
import toastrService from '../services/toastr.service';
import authService from '../services/auth.service';

export default class extends Component {
  state = {
    showPassword: false,
    loading: false,
    registrationComplete: false,
  };

  async register(form, actions) {
    actions.setSubmitting(false);
    this.setState({ loading: true });

    try {
      await authService.register(form.name, form.email, form.password);
      this.setState({ registrationComplete: true, loading: false });
    } catch(e) {
      if (e.messages) toastrService.error(e.messages);
      else toastrService.error('Something unexpected happened');
      this.setState({ loading: false });
    }
  }

  togglePassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  validateRequired(value) {
    if (!value) return 'This is a required field';

    return null;
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Register • 99wikis</title>
        </Helmet>

        <SimpleGrid columns={{sm: 1, md: 2}}>
          <Box
            width={{ sm: '100%', md: '40vw' }}
            height={{ sm: '10vh', md: '100vh'}}
            backgroundColor={theme.colors.blue['500']}
            d="flex"
            alignItems="center"
            justifyContent="center"
          >
            <img src="/images/logo-white.png" style={{ width: '30vw', maxWidth: '250px' }} />
          </Box>

          <Box
            width={{ sm: '100%', md: '60vw' }}
          >
            {
              this.state.registrationComplete
              ? (
                <Box 
                  d="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight={{ sm: '90vh', md: '100vh'}}
                >
                  <p>✅ nice, your registration is complete. <strong>Now ask the admin to approve your account.</strong></p>
                </Box>
              )
              : (
                <Box margin="0 auto" maxW="md" overflow="hidden">
                  <Formik
                    initialValues={{ }}
                    onSubmit={(values, actions) => this.register(values, actions)}
                  >
                    {props => (
                      <form onSubmit={props.handleSubmit}>
                        <Stack
                          spacing={4}
                          justify="center"
                          minHeight={{ sm: '90vh', md: '100vh'}}
                        >
                          <Box textAlign="center">
                            <Heading>Register</Heading>
                          </Box>
    
                          <Box>
                            <Field name="name" validate={(value) => this.validateRequired(value)}>
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.name && (form.touched.name || form.submitCount > 0)}>
                                  <InputGroup>
                                    <InputLeftElement children={<Box as={IoMdPerson} name="user" color="gray.300" />} />
                                    <Input id="name" {...field} type="text" placeholder="Your name" />
                                  </InputGroup>
                                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </Box>
    
                          <Box>
                            <Field name="email" validate={(value) => this.validateRequired(value)}>
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.email && (form.touched.email || form.submitCount > 0)}>
                                  <InputGroup>
                                    <InputLeftElement children={<Icon name="email" color="gray.300" />} />
                                    <Input id="email" {...field} type="mail" placeholder="Email" />
                                  </InputGroup>
                                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </Box>
    
                          <Box>
                            <Field name="password" validate={(value) => this.validateRequired(value)}>
                              {({ field, form }) => (
                                <FormControl isInvalid={form.errors.password && (form.touched.password || form.submitCount > 0)}>
                                  <InputGroup>
                                    <InputLeftElement children={<Icon name="lock" color="gray.300" />} />
    
                                    <Input
                                      { ...field }
                                      id="password"
                                      type={this.state.showPassword ? "text" : "password"}
                                      placeholder="Password"
                                    />
    
                                    <InputRightElement width="4.5rem">
                                      <Button h="1.75rem" size="sm" onClick={() => this.togglePassword()}>
                                        {this.state.showPassword ? "Hide" : "Show"}
                                      </Button>
                                    </InputRightElement>
                                  </InputGroup>
                                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </Box>
    
                          <Box textAlign="center">
                            <Button
                              isLoading={this.state.loading}
                              variantColor="blue"
                              variant="solid"
                              width="100%"
                              type="submit"
                            >
                              Create Account
                            </Button>
                          </Box>
                          <Box textAlign="center">
                            <Link to="/login">go to login</Link>
                          </Box>
                        </Stack>
                      </form>
                    )}
                  </Formik>
                </Box>  
              )
            }
          </Box>
        </SimpleGrid>
      </div>
    );
  }
};
