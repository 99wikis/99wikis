import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Formik, Field } from 'formik';
import {
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Icon,
  Stack,
  Box,
  Heading,
  Button,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/core";

export default class extends Component {
  state = {
    showPassword: false,
    loading: false,
  };

  login(form, actions) {
    actions.setSubmitting(false);
    this.setState({ loading: true });

    setTimeout(() => {
      console.log(form);
      this.setState({ loading: false });
    }, 1000);
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
      <div className="container">
        <Helmet>
          <title>Login • 99wikis</title>
        </Helmet>

        <Box textAlign="center">
          <Heading>Login</Heading>
        </Box>

        <br />

        <Box margin="0 auto" maxW="md" overflow="hidden">
          <Formik
            initialValues={{ }}
            onSubmit={(values, actions) => this.login(values, actions)}
          >
            {props => (
              <form onSubmit={props.handleSubmit}>
                <Stack spacing={4}>
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
                      variantColor="teal"
                      variant="solid"
                      width="100%"
                      type="submit"
                    >
                      Enter
                    </Button>
                  </Box>
                </Stack>
              </form>
            )}
          </Formik>
        </Box>
        
      </div>
    );
  }
};
