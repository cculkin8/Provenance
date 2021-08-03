import "./Search.css"
const Search = () => (
    <form action="/" method="get">
        <label htmlFor="header-search">
            <span className="visually-hidden">Search Listings</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Search Listings"
            name="s" 
        />
        <button type="submit">Search</button>
    </form>
);

export default Search;