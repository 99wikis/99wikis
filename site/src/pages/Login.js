import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { Formik, Field } from 'formik';
import theme from '../theme'
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
  };

  async login(form, actions) { 
    actions.setSubmitting(false);
    this.setState({ loading: true });

    try {
      const token = await authService.login(form.email, form.password);
      localStorage.token = token;

      const user = await authService.getSession();
      localStorage.user = JSON.stringify(user);

      this.props.history.push('/');
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
          <title>Login • 99wikis</title>
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
            <Box margin="0 auto" maxW="md" overflow="hidden">
              <Formik
                initialValues={{ }}
                onSubmit={(values, actions) => this.login(values, actions)}
              >
                {props => (
                  <form onSubmit={props.handleSubmit}>
                    <Stack
                      spacing={4}
                      justify="center"
                      minHeight={{ sm: '90vh', md: '100vh'}}
                    >
                      <Box textAlign="center">
                        <Heading>Login</Heading>
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
                          Enter
                        </Button>
                      </Box>
                      <Box textAlign="center">
                        <Link to="/register">create account</Link>
                      </Box>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Box>
          </Box>
        </SimpleGrid>
      </div>
    );
  }
};
