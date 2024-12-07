const RenderFooter = () => {
    return (
        <footer className="py-3 text-center text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center justify-center gap-1">
                Created by{" "}
                <a href="https://raihankalla.id" className="underline" target="_blank" rel="noopener noreferrer">
                    Al Harkan
                </a>{" "}
                |{" "}
                <a href="mailto:enaiblr@gmail.com" target="_blank" rel="noopener noreferrer">
                    Report a Bug
                </a>
            </p>
        </footer>
    )
};

export default RenderFooter;
