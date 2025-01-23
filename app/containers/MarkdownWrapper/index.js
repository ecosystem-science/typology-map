import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { connect } from 'react-redux';
import { compose } from 'redux';

import MarkdownImage from 'components/MarkdownImage';

import { navigate } from 'containers/App/actions';
import { startsWith } from 'utils/string';

const MarkdownWrapper = ({ content, onNavigate }) => (
  <Markdown
    remarkPlugins={[remarkGfm]}
    components={{
      img({ src, alt }) {
        return <MarkdownImage image={{ src, caption: alt }} />;
      },
      a({ href, children, node }) {
        // internal link
        if (startsWith(href, '/')) {
          return (
            <a
              onClick={(e) => {
                if (e) e.preventDefault();
                onNavigate(href.slice(1));
              }}
              href={href}
            >
              {children}
            </a>
          );
        }
        return <a target="_blank" href={href}>{children}</a>;
      }
    }}
  >
    {content.replace(/\n/, '\n\n')}
  </Markdown>
);

MarkdownWrapper.propTypes = {
  content: PropTypes.string,
  onNavigate: PropTypes.func,
}

function mapDispatchToProps(dispatch) {
  return {
    onNavigate: location => dispatch(navigate(location)),
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(MarkdownWrapper);
