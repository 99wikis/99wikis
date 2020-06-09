import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Box,
} from "@chakra-ui/core";
import TopicList from '../components/TopicList';
import ArticleList from '../components/ArticleList';

export default class extends Component {
  state = { };

  render() {
    return (
      <div>
        <Helmet>
          <title>Home • 99wikis</title>
        </Helmet>

        <Box
          margin="0 auto"
          maxW="6xl"
          p={6}
          overflow="hidden"
        >
          <TopicList />

          <ArticleList {...this.props} />
        </Box>
      </div>
    );
  }
};
