# AquaByMe-frontend

## Structure
    src/
    ├─ ...
    ├─ assets/                  # images used in different views 
    │  ├─ LetsDraw.png          # sketch
    │  ├─ choosechoose.png      # gallery
    │  ├─ fishBowlCanvas.png    # sketch
    │  └─ myart.png             # mystickers
    ├─ config.js                # holds the server information
    ├─ hooks/
    │  ├─ configs.js
    │  └─ useAuth.js            # handles logins and outs
    └─ views/
       ├─ Main.js               # main
       ├─ Main.module.less
       ├─ gallery/              # pick stickers(other users + mine) to display at home
       │  ├─ Gallery.css
       │  └─ Gallery.js
       ├─ home/                 # aquarium page
       │  ├─ Home.css
       │  └─ Home.js
       ├─ login/                # login view used in main
       │  ├─ Login.js
       │  └─ Login.module.less
       ├─ mystickers/           # my drawings
       │  └─ MyStickers.js
       ├─ settings/             # process status (luna api)
       │  ├─ BarChart.js
       │  ├─ ChartTheme.js
       │  ├─ PieChartGrid.js
       │  └─ Settings.js
       └─ sketch/               # where drawings are done
          └─ Sketch.js

## View Components
**1. Main**
- 로그인 유무를 확인하고 로그인이 되어 있지 않다면 Login 화면으로 리디렉션
- sandstone의 TabLayout과 Panels를 활용해 네비게이션을 구성, 원하는 탭 선택 가능
 
**2. Login**  
- 아이디, 비밀번호를 입력해 로그인 할 수 있는 화면
- 회원가입 버튼으로 sandstone의 Alert를 띄워 회원가입 진행 가능

**3. Home**
- Aqua By Me의 Aquarium 페이지, 서버에서 유저가 선택해두었던 스티커들을 불러온다
- 전체 화면 버튼  

**4. Sketch**  
- 유저가 직접 스티커를 그릴 수 있는 화면
- fabric.js와 react-color를 활용해 그림판 화면 구성 

**5. My Stickers**  
- 로그인 된 유저가 그린 스티커들의 목록을 확인하고, 관리할 수 있는 화면
- sandstone의 VirtualGridList를 활용해 구성

**6. Gallery**  
- Swimming Friends(Home에 보여지고 있는 스티커)와 Waiting Friends(보여지고 있지 않는 스티커)로 나누어 유저가 Home에 어떤 스티커를 올릴 지 선택할 수 있는 화면
- sandstone의 VirtualList를 활용해 구성

**7. Settings**  
- luna api를 활용하여 프로세스의 자원 사용량을 표시하는 화면
 
  **7-1. BarChart**  
  - 메모리 사용량 표시를 위해 구현한 바 그래프
    
  **7-2. PieChartGrid**  
  - CPU 사용량 표시를 위해 구현한 도넛 모양 그래프

  
## Contributors
- 신지원([@ena-isme](https://github.com/ena-isme))
- 이가연([@its-gayeon](https://github.com/its-gayeon))
