import React from "react";

function PostLoading(Component) {
    // ...props is called spread attributes which makes the passing of props easier
    // - we can pass multiple props
    return function PostLoadingComponent({ isLoading, ...props }) {
        if(!isLoading) return <Component {...props} />;
        return(
            <p style={{ fontSize: '25px'}}>
                Waiting for the data to load!!!!
            </p>
        );
    };
}
export default PostLoading;