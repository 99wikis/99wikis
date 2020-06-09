import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import {
  Box,
  Spinner,
  Input,
  Stack,
  FormControl,
  FormErrorMessage,
  Textarea,
  Button,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Checkbox,
  Text,
} from "@chakra-ui/core";
import toastrService from '../services/toastr.service';
import articleService from '../services/article.service';

export default class extends Component {
  state = {
    article: {
      topic: '',
      title: '',
      body: '',
      public: false,
    },
    loading: true,
  };

  constructor(props) {
    super(props);

    if (this.props.match.params.id) this.loadArticle();
    else this.state.loading = false;
  }

  async loadArticle() {
    const article = await articleService.getById(this.props.match.params.id);

    this.setState({ article, loading: false });
  }

  async submit(form, actions) { 
    actions.setSubmitting(false);
    const articleModel = { ...this.state.article, ...form };

    this.setState({ article: articleModel, loading: true }, async () => {
      try {
        let article = null;

        if (this.state.article.id) article = await articleService.update(this.state.article.id, this.state.article);
        else article = await articleService.create(this.state.article);
  
        this.props.history.push(`/a/${article.id}`);
      } catch(e) {
        if (e.messages) toastrService.error(e.messages);
        else toastrService.error('Something unexpected happened');
  
        this.setState({ loading: false });
      }
    });
  }

  validateRequired(value) {
    if (!value) return 'This is a required field';

    return null;
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

    let title = this.state.loading ? 'Loading...' : this.state.article.title;
    if (title === '') title = 'New Article';

    return (
      <div>
        <Helmet>
          <title>{title} • 99wikis</title>
        </Helmet>

        <Box
          margin="0 auto"
          maxW="6xl"
          p={6}
          overflow="hidden"
        >
          <PageBreadcrumb article={this.state.article} />

          <Formik
            initialValues={this.state.article}
            onSubmit={(values, actions) => this.submit(values, actions)}
          >
            {props => (
              <form onSubmit={props.handleSubmit}>
                <Stack
                  spacing={4}
                >
                  <Box>
                    <Field name="title" validate={(value) => this.validateRequired(value)}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.title && (form.touched.title || form.submitCount > 0)}>
                          <Text fontSize="lg" fontWeight={600}>Title</Text>
                          <Input id="title" {...field} variant="flushed" placeholder="Article title (i.e. How to get to the moon in topic 30 minutes)" size="lg" />
                          <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Box>
                    <Field name="topic" validate={(value) => this.validateRequired(value)}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.topic && (form.touched.topic || form.submitCount > 0)}>
                          <Text fontSize="lg" fontWeight={600}>Topic</Text>
                          <Input label="Topic" id="topic" {...field} variant="flushed" placeholder="Article topic (i.e. Engineering)" />
                          <FormErrorMessage>{form.errors.topic}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Box>
                    <Field name="body" validate={(value) => this.validateRequired(value)}>
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.body && (form.touched.body || form.submitCount > 0)}>
                          <Textarea id="body" {...field} placeholder="Here is a sample placeholder" resize="vertical" />
                          <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Box>
                    <Field name="public">
                      {({ field, form }) => (
                        <FormControl>
                          <Checkbox
                            id="public"
                            {...field}
                            isChecked={field.value}
                          >
                            Make article public?
                          </Checkbox>
                        </FormControl>
                      )}
                    </Field>
                  </Box>

                  <Box>
                    <Button
                      isLoading={this.state.loading}
                      variantColor="blue"
                      variant="solid"
                      type="submit"
                    >
                      { this.state.article.id ? 'Update Article' : 'Create Article' }
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

const PageBreadcrumb = ({ article } = {}) => (
  <Breadcrumb
    spacing="8px"
    separator={<Icon color="gray.300" name="chevron-right" />}
    marginBottom={4}
  >
    <BreadcrumbItem>
      <BreadcrumbLink as={Link} to="/">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>

    {
      article.id 
      && (
        <BreadcrumbItem>
          <BreadcrumbLink  as={Link} to={`/a/${article.id}`}>{ article.title }</BreadcrumbLink>
        </BreadcrumbItem>
      )
    }

    {
      article.id 
      && (
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      )
    }

    {
      !article.id
      && (
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>New Article</BreadcrumbLink>
        </BreadcrumbItem>
      )
    }
  </Breadcrumb>
)
