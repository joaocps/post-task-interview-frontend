import React from "react";

function PostLoading(Component) {
    // ...props is called spread attributes which makes the passing of props easier
    // - we can pass multiple props
    return function PostLoadingComponent({ isLoading, ...props }) {
        if(!isLoading) return <Component {...props} />;
        return(
            <p style={{ fontSize: '25px'}}>
                <img src={"https://stackify.com/wp-content/uploads/2018/10/Web-API-Error-Handling2-1024x512.jpg"} alt="Logo" />
            </p>
        );
    };
}
export default PostLoading;