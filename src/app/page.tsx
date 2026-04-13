/**
 * @file src/app/page.tsx - 메인 홈 페이지 컴포넌트
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 애플리케이션의 루트 경로("/")에 렌더링되는 메인 페이지입니다.
 * 프로젝트의 초기 진입점으로서 서비스의 핵심 기능을 소개하거나
 * 주요 대시보드로 이동하기 위한 사용자 인터페이스를 제공합니다.
 * 전역 테마(DaisyUI)와 폰트 설정이 적용된 기본적인 UI 요소를 통해
 * 서비스의 시각적 레이아웃을 구성합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

export default function Home() {
  return (
    <div>
      <button className="btn btn-primary">Primary</button>
      <span>Hello</span>
      <span className="font-sans">Hello</span>
    </div>
  );
}
