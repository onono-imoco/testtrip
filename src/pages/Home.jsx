import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem'}}>
      <h1>ようこそ！ラントリへ</h1>
      <p>さぁまだ見ぬ場所へ</p>
      <Link to="/select">
        <button style={{ padding: '1rem 2rem', fontSize: '1.2rem'}}>
          ランダムで旅行先を選ぶ
        </button>
      </Link>
    </div>
  );
}

export default Home;