import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState("09150754-6679-0216-0000-70adaa339576");
  const [data, setData] = useState([]);

  const postTask = async () => {
    setLoading(true);
    const post_array = [];
    post_array.push({
      "target": inputUrl,
      "max_crawl_pages": 10,
      "load_resources": false,
      "enable_javascript": false,
      "custom_js": "meta = {}; meta.url = document.URL; meta;",
      "tag": "some_string_123"
    })

    await axios({
      method: 'post',
      url: 'https://api.dataforseo.com/v3/on_page/task_post',
      auth: {
        username: 'nakullanjewar2001@gmail.com',
        password: 'ae603c98611ccb0f'
      },
      data: post_array,
      headers: {
        'content-type': 'application/json'
      }
    }).then(function (response) {
      var result = response['data']['tasks'];
      console.log(result);
      setTaskId(result[0].id);
      console.log(taskId);
      setLoading(false);
      return result;
    }).catch(function (error) {
      console.log(error);
      setLoading(false);
    });
  }

  const getSummary = async () => {
    setLoading(true);
    await axios({
      method: 'get',
      url: 'https://api.dataforseo.com/v3/on_page/summary/' + taskId,
      auth: {
        username: 'nakullanjewar2001@gmail.com',
        password: 'ae603c98611ccb0f'
      },
      headers: {
        'content-type': 'application/json'
      }
    }).then(function (response) {
      var result = response['data']['tasks'];
      // Result data
      console.log(result);
      setData(result);
      setLoading(false);
    }).catch(function (error) {
      console.log(error);
      setLoading(false);
    });
  }

  const handleClick = async () => {
    console.log(inputUrl);
    await postTask();
    await getSummary();
  }
  return (
    <>
      <div className='bg-[#121212] m-6'>
        <div className="flex  items-center w-75 justify-start gap-1 border-t-[1px] border-white px-4 py-2 md:gap-4 md:border-[1px] md:shadow-[5px_5px_0px_0px_#4f4e4e]">
          <input
            placeholder="Paste Url here..."
            type='text'
            className="w-full bg-transparent p-2 text-sm text-white !outline-none placeholder:text-gray-500 md:p-4 md:text-base"
            onChange={(e) => setInputUrl(e.target.value)}
          />
          <button className="bg-[#ae7aff] text-white px-4 py-2 rounded-md text-sm md:px-6 md:py-4 md:text-base" onClick={handleClick}>Check</button>
        </div>

      </div>
        {loading && <LoadingComponent />}
        {data.length > 0 && <ResultComponent data={data} />}
    </>
  )
}

function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )
}

const ResultComponent = ({ data }) => {
  const {
    domain_info,
    page_metrics,
    crawl_status,
    crawl_progress,
    crawl_gateway_address,
    crawl_stop_reason,
  } = data[0].result[0];

  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Domain Info</h2>
      <p>Name: {domain_info.name}</p>
      <p>IP: {domain_info.ip}</p>
      <p>Server: {domain_info.server}</p>
      <p>Total Pages: {domain_info.total_pages}</p>

      <h2 className="text-xl font-bold mt-4 mb-2">Page Metrics</h2>
      <p>External Links: {page_metrics.links_external}</p>
      <p>Internal Links: {page_metrics.links_internal}</p>
      <p>On Page Score: {page_metrics.onpage_score}</p>

      <h2 className="text-xl font-bold mt-4 mb-2">Crawl Status</h2>
      <p>Pages Crawled: {crawl_status.pages_crawled}</p>
      <p>Pages in Queue: {crawl_status.pages_in_queue}</p>
      <p>Max Crawl Pages: {crawl_status.max_crawl_pages}</p>

      <h2 className="text-xl font-bold mt-4 mb-2">Crawl Information</h2>
      <p>Progress: {crawl_progress}</p>
      <p>Gateway Address: {crawl_gateway_address}</p>
      <p>Stop Reason: {crawl_stop_reason}</p>
    </div>
  );
};

export default App