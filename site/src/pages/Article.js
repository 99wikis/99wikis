import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { IoIosMore } from 'react-icons/io';
import {
  Box,
  Spinner,
  Heading,
  Badge,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
} from "@chakra-ui/core";
import articleService from '../services/article.service';

export default class extends Component {
  state = {
    article: {},
    loading: true,
    isDeleteConfirmOpen: false,
  };

  constructor(props) {
    super(props);

    this.loadArticle();
  }

  async loadArticle() {
    const article = await articleService.getById(this.props.match.params.id);

    article.createdAt = new Date(article.createdAt);

    this.setState({ article, loading: false });
  }

  async togglePublic() {
    const articleModel = { ...this.state.article };
    articleModel.public = !articleModel.public;

    const article = await articleService.update(articleModel.id, articleModel);

    article.createdAt = new Date(article.createdAt);

    this.setState({ article });
  }

  async deleteArticle() {
    this.setState({ loading: true });

    await articleService.remove(this.state.article.id);

    this.props.history.push(`/`);
  }

  toggleDeleteConfirm() {
    this.setState({ isDeleteConfirmOpen: !this.state.isDeleteConfirmOpen });
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
          <title>{ this.state.loading ? 'Loading...' : this.state.article.title} • 99wikis</title>
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
              <BreadcrumbLink>{ this.state.article.title }</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box
            d="flex"
            justifyContent="space-between"
          >
            <Box>
              <Heading as="h1" size="xl">
                { this.state.article.title }
              </Heading>

              <Box d="flex" alignItems="baseline" marginTop={2}>
                <Badge rounded="full" px="3" variantColor="blue" color="white">
                  { this.state.article.topic }
                </Badge>
                <Box
                  color="gray.500"
                  fontWeight="semibold"
                  letterSpacing="wide"
                  fontSize="xs"
                  textTransform="uppercase"
                  ml="2"
                >
                  { this.state.article.createdByName } &bull; { `${this.state.article.createdAt.getMonth() + 1}/${this.state.article.createdAt.getDate()}/${this.state.article.createdAt.getFullYear()} at ${this.state.article.createdAt.getHours()}:${this.state.article.createdAt.getMinutes()}` }
                </Box>
              </Box>
            </Box>

            <Menu>
              <MenuButton as={Button} rightIcon="chevron-down">
                <Box as={IoIosMore} />
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to={`/a/${this.state.article.id}/edit`}>Edit</MenuItem>
                <MenuItem onClick={() => this.togglePublic()}>{ this.state.article.public ? 'Make private' : 'Make public' }</MenuItem>
                <MenuItem onClick={() => this.toggleDeleteConfirm()}>Delete</MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Box
            width="100%"
            marginTop={8}
          >
            <div dangerouslySetInnerHTML={{__html: this.state.article.body}}></div>
          </Box>
        </Box>

        <AlertDialog
          isOpen={this.state.isDeleteConfirmOpen}
          onClose={() => this.toggleDeleteConfirm()}
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Article?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => this.toggleDeleteConfirm()}>
                Cancel
              </Button>
              <Button
                variantColor="red"
                onClick={() => this.deleteArticle()}
                ml={3}
                isLoading={this.state.loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
};
