import './Loader.css';
// import loaderGif from './loader.gif';
import loaderGif from './loader-two.gif';

export default function Loader({ display }){
    return( <div id="loader" style={{ display : display == 'show' ? 'block' : 'none' }}>
                <img src={loaderGif} alt="loader image"/>
            </div>);
}