import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Router from 'next/router'

import { isClient } from 'app/lib/func'

const query = gql`
  query CurrentUser {
    user: currentUserContext {
      uid
      name
      mail
    }
  }
`
const CurrentUserContainer = ({ children }) => (
  <Query query={ query }>
    { ({ ...result, loading, refetch, data }) => {
      
      if(data.user && data.user.uid){
        return children({ ...result, user: data.user })
      }

      // Force a refetch on the client inside to make sure
      // the cached SSR anonymous user is replaced, in case
      // the user is already logged in..
      if (!loading && isClient()) {
        refetch().then( re => {
            if(!re.data.user.uid){
                Router.push('/');
            }
        })
      }

      return null
    } }
  </Query>
)

CurrentUserContainer.propTypes = {
  children: func,
}

export default CurrentUserContainer
