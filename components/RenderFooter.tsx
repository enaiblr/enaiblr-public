const RenderFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="py-3 text-center text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center justify-center">
                &copy; {currentYear}&nbsp; 
                <a href="https://enaiblr.org/about" className="text-blue-600" target="_blank" rel="noopener noreferrer">Enaiblr</a>.
                {" "}
                All rights reserved. | 
                {" "}
                <a href="mailto:enaiblr@gmail.com" target="_blank" rel="noopener noreferrer">&nbsp;Report a Bug</a>
            </p>
        </footer>
    )
};

export default RenderFooter;
