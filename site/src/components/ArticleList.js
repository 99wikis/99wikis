import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Skeleton,
  Badge,
  Button,
} from "@chakra-ui/core";
import articleService from '../services/article.service';

export default class extends Component {
  state = {
    articles: [],
    loading: true,
  }

  constructor(props) {
    super(props);

    this.loadArticles();
  }

  async loadArticles() {
    const articles = await articleService.get();

    articles.map(a => {
      a.createdAt = new Date(a.createdAt);
      return a;
    });

    this.setState({ articles, loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
      <Box
        width="100%"
      >
        <Heading marginBottom={3} size="xl">Articles</Heading>
        <Skeleton height="100px"></Skeleton>
        <Skeleton height="100px" marginTop={4}></Skeleton>
        <Skeleton height="100px" marginTop={4}></Skeleton>
        <Skeleton height="100px" marginTop={4}></Skeleton>
      </Box>);
    }

    return (
      <Box
        width="100%"
      >
        <Box d="flex" justifyContent="space-between" >
          <Heading marginBottom={3} size="xl">Articles</Heading>
          <Button variantColor="blue" variant="solid" as={Link} to="/a/new">
            Create Article
          </Button>
        </Box>

        { this.state.articles.map(article => <Article article={article} />) } 
      </Box>
    );
  }
}

const Article = ({ article } = {}) => {
  return (
    <Box
      minHeight="50px"
      border="2px"
      backgroundColor="transparent"
      px={6}
      py={4}
      marginBottom={4}
      rounded={5}
    >
      <Heading as="h3" size="lg">
        <Link to={`a/${article.id}`}>{ article.title }</Link>
      </Heading>

      <Box d="flex" alignItems="baseline" marginTop={2}>
        <Badge rounded="full" px="3" variantColor="blue" color="white">
          { article.topic }
        </Badge>
        <Box
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
          ml="2"
        >
          { article.createdByName } &bull; { `${article.createdAt.getMonth() + 1}/${article.createdAt.getDate()}/${article.createdAt.getFullYear()} at ${article.createdAt.getHours()}:${article.createdAt.getMinutes()}` }
        </Box>
      </Box>
    </Box>
  );
}
