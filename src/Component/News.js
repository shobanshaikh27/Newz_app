import React, { useEffect ,useState} from 'react'

import Newsitem from './Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
    const[articles,setArticles]  = useState([])
    const[loading,setLoading]  = useState(true)
    const[page,setPage]  = useState(1)
    const[totalResults,settotalResults]  = useState(0)
    
        const capitalizeFirstLetter = (string) =>{
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
        
        // document.title=`${capitalizeFirstLetter(props.category)} - Newzz`;

        
        const update =async ()=>{
            props.setProgress(10);
            const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
            setLoading(true);
            let data = await fetch(url);
            props.setProgress(30);
            let parseddata = await data.json()
            //console.log(parseddata); 
            props.setProgress(70);
            setArticles(parseddata.articles)
                settotalResults(parseddata.totalResults)
                setLoading(false)
                props.setProgress(100);  
            
        }

        useEffect(() =>{
            update();
            //esint disable next line
        },[] )
 
       const fetchMoreData =async () => {
          const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
          setPage(page+1)
          let data = await fetch(url);
          let parseddata = await data.json()
          
              setArticles(articles.concat(parseddata.articles))
              settotalResults(parseddata.totalResults)
              };
    

  
    return (
      
        <>
        <h1 className="text-center" style={{margin:"35px 0px", marginTop:"90px"}}>Newzzz - Top Headlines From {capitalizeFirstLetter(props.category)}</h1>
        {/* {loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length<totalResults}
          loader={<Spinner/>}
        >
            <div className="container">
        <div className="row">
        {articles.map((element,index)=>{
            return  <div className="col-md-4" key={index}>
            <Newsitem  title={element.title?element.title.slice(0, 45):""} description={element.description?element.description.slice(0, 88):""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
        </div>
        })}
    </div>
    </div>
    </InfiniteScroll>
    </>
    )
}


export default News;
News.defaultProps = {
    couuntry: 'in',
    pageSize: 8,
    category:'general',
    
}
News.propTypes ={
    country: PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string,
}
