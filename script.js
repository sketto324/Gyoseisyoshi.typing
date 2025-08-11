document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultScreen = document.getElementById('result-screen');
    const startButton = document.getElementById('start-button');
    const retryButton = document.getElementById('retry-button');

    const shihanImage = document.getElementById('shihan-image');
    const questionTerm = document.getElementById('question-term');
    const questionYomigana = document.getElementById('question-yomigana');
    const inputArea = document.getElementById('input-area');
    const feedbackMessage = document.getElementById('feedback-message');
    const explanation = document.getElementById('explanation');

    const finalTime = document.getElementById('final-time');
    const resultMessage = document.getElementById('result-message');

    // Game State
    let currentQuestions = [];
    let questionIndex = 0;
    let gameStartTime;

    const IDLE_IMG = 'images/shihan_idle.png';
    const CORRECT_IMG = 'images/shihan_correct.png';
    const WRONG_IMG = 'images/shihan_wrong.png';

    // --- Data Loading ---
    const allQuestions = [
        { term: '公権力の行使', yomigana: 'こうけんりょくのこうし', desc: '国や地方公共団体が法に基づいて国民に対して権力を行使すること' },
        { term: '憲法改正', yomigana: 'けんぽうかいせい', desc: '日本国憲法の条文を改正する手続き（国会の発議と国民投票が必要）' },
        { term: '瑕疵ある意思表示', yomigana: 'かしあるいしひょうじ', desc: '錯誤・詐欺・強迫などにより欠陥のある契約意思表示' },
        { term: '債務不履行', yomigana: 'さいむふりこう', desc: '契約などの義務を履行しないこと' },
        { term: '無効な行政行為', yomigana: 'むこうなぎょうせいこうい', desc: '法律に重大な違反があり、最初から効力がない行政行為' },
        { term: '行政手続法', yomigana: 'ぎょうせいてつづきほう', desc: '行政手続の公正・透明性を確保するための法律' },
        { term: '不服申立て', yomigana: 'ふふくもうしたて', desc: '行政処分に不満がある場合に上級機関に審査や取消しを求める手続き' },
        { term: '裁量権の逸脱・濫用', yomigana: 'さいりょうけんのいつだつらんよう', desc: '行政庁が与えられた裁量の範囲を逸脱したり不当な目的で使うこと' },
        { term: '違憲審査権', yomigana: 'いけんしんさけん', desc: '法律や命令が憲法に違反していないかを判断する権限' },
        { term: '三権分立', yomigana: 'さんけんぶんりつ', desc: '立法・行政・司法の権力を分けて相互に抑制する仕組み' },
        { term: '民法総則', yomigana: 'みんぽうそうそく', desc: '民法の基本原則や一般的な規定をまとめた部分' },
        { term: '制限行為能力者', yomigana: 'せいげんこういのうりょくしゃ', desc: '未成年者や成年被後見人など法律行為の能力が制限される者' },
        { term: '意思能力', yomigana: 'いしのうりょく', desc: '自分の行為の結果を判断できる能力' },
        { term: '代理権', yomigana: 'だいりけん', desc: '他人を代理して法律行為をする権限' },
        { term: '時効取得', yomigana: 'じこうしゅとく', desc: '一定期間占有することで所有権を取得する制度' },
        { term: '消滅時効', yomigana: 'しょうめつじこう', desc: '一定期間権利を行使しないことで権利が消滅する制度' },
        { term: '契約自由の原則', yomigana: 'けいやくじゆうのげんそく', desc: '契約の相手や内容を自由に決められるという民法の原則' },
        { term: '瑕疵担保責任', yomigana: 'かしたんぽせきにん', desc: '売買された物に欠陥がある場合に売主が負う責任' },
        { term: '不当利得', yomigana: 'ふとうりとく', desc: '法律上の理由なく利益を得た場合に返還を求められる制度' },
        { term: '不法行為', yomigana: 'ふほうこうい', desc: '他人に損害を与えた場合の賠償責任を定める制度' },
        { term: '行政不服審査法', yomigana: 'ぎょうせいふふくしんさほう', desc: '行政処分への不服申立て手続きを定める法律' },
        { term: '行政事件訴訟法', yomigana: 'ぎょうせいじけんそしょうほう', desc: '行政処分の取消しなどを求める訴訟の手続きを定めた法律' },
        { term: '義務付け訴訟', yomigana: 'ぎむづけそしょう', desc: '行政庁に義務の履行を命じることを求める訴訟' },
        { term: '国家賠償法', yomigana: 'こっかばいしょうほう', desc: '国や地方公共団体の違法行為による損害を賠償する法律' },
        { term: '行政指導', yomigana: 'ぎょうせいしどう', desc: '行政機関が任意の協力を求める行為（法的強制力なし）' },
        { term: '地方自治の本旨', yomigana: 'ちほうじちのほんし', desc: '住民の意思に基づき自治を行うという地方自治の基本理念' },
        { term: '国会議員の不逮捕特権', yomigana: 'こっかいぎいんのふたいほとっけん', desc: '国会会期中は議員が逮捕されない特権（一定の例外あり）' },
        { term: '免責特権', yomigana: 'めんせきとっけん', desc: '議院内での発言や表決について責任を問われない特権' },
        { term: '弾劾裁判所', yomigana: 'だんがいさいばんしょ', desc: '裁判官の罷免を審査する特別な裁判所' },
        { term: '特別法', yomigana: 'とくべつほう', desc: '特定の地域や人にだけ適用される法律' },
        { term: '強行規定', yomigana: 'きょうこうきてい', desc: '当事者の合意で排除できない法律規定' },
        { term: '任意規定', yomigana: 'にんいきてい', desc: '当事者の合意で変更できる法律規定' },
        { term: '代理契約', yomigana: 'だいりけいやく', desc: '代理人が本人に代わって契約をすること' },
        { term: '表見代理', yomigana: 'ひょうけんだいり', desc: '外見上代理権があるように見える場合に成立する代理' },
        { term: '既判力', yomigana: 'きはんりょく', desc: '確定判決の内容が再度争われない効力' },
        { term: '国民主権', yomigana: 'こくみんしゅけん', desc: '国家の政治の最終的な権威は国民にあるという原則' },
        { term: '基本的人権の尊重', yomigana: 'きほんてきじんけんのそんちょう', desc: '人間が生まれながらに持つ権利を最大限尊重すること' },
        { term: '法の下の平等', yomigana: 'ほうのもとのびょうどう', desc: '全ての人は法律のもとで平等に扱われるという原則' },
        { term: '財政民主主義', yomigana: 'ざいせいみんしゅしゅぎ', desc: '国の財政活動は国会の議決を経なければならないという原則' },
        { term: '参議院の緊急集会', yomigana: 'さんぎいんのきんきゅうしゅうかい', desc: '衆議院解散中の緊急時に参議院だけで国会を開く制度' },
        { term: '国政調査権', yomigana: 'こくせいちょうさけん', desc: '国会が国の政治全般を調査する権限' },
        { term: '条件付意思表示', yomigana: 'じょうけんつきいしひょうじ', desc: '一定の条件が成就することで効力が発生または消滅する意思表示' },
        { term: '使用貸借契約', yomigana: 'しようたいしゃくけいやく', desc: '無償で物を借りその使用後に返す契約' },
        { term: '賃貸借契約', yomigana: 'ちんたいしゃくけいやく', desc: '有償で物や権利を貸し借りする契約' },
        { term: '請負契約', yomigana: 'うけおいけいやく', desc: '仕事の完成を約して報酬を受け取る契約' },
        { term: '承継取得', yomigana: 'しょうけいしゅとく', desc: '前の権利者から権利を引き継ぐこと' },
        { term: '共有物分割', yomigana: 'きょうゆうぶつぶんかつ', desc: '共有物を持分に応じて分けること' },
        { term: '所有権の侵害', yomigana: 'しょゆうけんのしんがい', desc: '他人の所有物を無断で使用・処分すること' },
        { term: '地役権', yomigana: 'ちえきけん', desc: '他人の土地を一定の目的で利用する権利' },
        { term: '根抵当権', yomigana: 'ねていとうけん', desc: '継続的取引など将来の債権を担保する抵当権' },
        { term: '先取特権', yomigana: 'さきどりとっけん', desc: '他の債権者より先に弁済を受けることができる法定担保物権' },
        { term: '不法原因給付', yomigana: 'ふほうげんいんきゅうふ', desc: '違法な原因に基づいて行われた給付' },
        { term: '債権譲渡', yomigana: 'さいけんじょうと', desc: '債権者が債権を第三者に移転すること' },
        { term: '債務引受', yomigana: 'さいむひきうけ', desc: '第三者が債務者に代わって債務を負担すること' },
        { term: '行政計画', yomigana: 'ぎょうせいけいかく', desc: '行政機関が将来の施策方針を定める計画' },
        { term: '権限委譲', yomigana: 'けんげんいじょう', desc: '国から地方公共団体などへ権限を移すこと' },
        { term: '行政代執行', yomigana: 'ぎょうせいだいしっこう', desc: '義務者が行わない場合に行政機関が代わって義務を実行すること' },
        { term: '即時強制', yomigana: 'そくじきょうせい', desc: '法律に基づかずに緊急に行われる行政行為' },
        { term: '公訴時効', yomigana: 'こうそじこう', desc: '一定期間を経過すると刑事訴追ができなくなる制度' },
        { term: '確定判決', yomigana: 'かくていはんけつ', desc: '不服申立て期間が過ぎて確定した判決' },
        { term: '強制執行', yomigana: 'きょうせいしっこう', desc: '債務者が任意に履行しない場合に裁判所が強制的に実行する手続き' },
        { term: '婚姻届', yomigana: 'こんいんとどけ', desc: '婚姻を成立させるために役所に提出する届出' },
        { term: '法定相続分', yomigana: 'ほうていそうぞくぶん', desc: '法律で定められた相続分の割合' },
        { term: '遺留分', yomigana: 'いりゅうぶん', desc: '相続人が最低限確保できる遺産の割合' },
        { term: '特別受益', yomigana: 'とくべつじゅえき', desc: '被相続人から特別に受けた利益' },
        { term: '所有権移転登記', yomigana: 'しょゆうけんいてんとうき', desc: '不動産の所有権が移ったことを登記簿に記載すること' },
        { term: '保存登記', yomigana: 'ほぞんとうき', desc: '不動産の所有権を初めて登記すること' },
        { term: '無権代理', yomigana: 'むけんだいり', desc: '代理権のない者が代理行為を行うこと' },
        { term: '取消し', yomigana: 'とりけし', desc: '有効に成立した行為の効力を将来に向かって消すこと' },
        { term: '無効確認訴訟', yomigana: 'むこうかくにんそしょう', desc: '行政行為が無効であることの確認を求める訴訟' },
        { term: '差止訴訟', yomigana: 'さしとめそしょう', desc: '行政庁による違法な行為の防止を求める訴訟' },
        { term: '義務付け判決', yomigana: 'ぎむづけばんけつ', desc: '行政庁に一定の行為をする義務を命じる判決' },
        { term: '地方自治法', yomigana: 'ちほうじちほう', desc: '地方自治体の組織や運営を定める法律' },
        { term: '地方交付税', yomigana: 'ちほうこうふぜい', desc: '地方自治体間の財源格差を調整するための税' },
        { term: '住民監査請求', yomigana: 'じゅうみんかんさせいきゅう', desc: '住民が自治体の監査委員に違法・不当な財務行為の監査を求める制度' },
        { term: '住民訴訟', yomigana: 'じゅうみんそしょう', desc: '自治体の財務行為に違法がある場合に提起する訴訟' },
        { term: '公の営造物', yomigana: 'おおやけのえいぞうぶつ', desc: '道路や橋など公共の用に供される施設' },
        { term: '公用収用', yomigana: 'こうようしゅうよう', desc: '公共の利益のために土地などを強制取得すること' },
        { term: '損失補償', yomigana: 'そんしつほしょう', desc: '公共事業などで財産権が制限された場合の補償' },
        { term: '行政契約', yomigana: 'ぎょうせいけいやく', desc: '行政庁が当事者となる契約' },
        { term: '行政財産', yomigana: 'ぎょうせいざいさん', desc: '公用や公共の用に供する国有財産' },
        { term: '普通財産', yomigana: 'ふつうざいさん', desc: '行政目的に供されない国有財産' },
        { term: '国庫債務負担行為', yomigana: 'こっこさいむふたんこうい', desc: '将来にわたる支出義務を伴う契約行為' },
        { term: '補正予算', yomigana: 'ほせいよさん', desc: '当初予算を変更するための予算案' },
        { term: '条例制定権', yomigana: 'じょうれいていせいけん', desc: '地方自治体が条例を制定する権限' },
        { term: '条例改廃権', yomigana: 'じょうれいかいはいけん', desc: '地方自治体が条例を改正・廃止する権限' },
        { term: '行政指揮監督権', yomigana: 'ぎょうせいしきかんとくけん', desc: '上級行政庁が下級行政庁を指揮・監督する権限' },
        { term: '行政行為', yomigana: 'ぎょうせいこうい', desc: '行政庁が行う一方的な法的効果を持つ行為' },
        { term: '準法律行為的行政行為', yomigana: 'じゅんほうりつこういてきぎょうせいこうい', desc: '法律の規定に基づき事実や状態を公証・確認する行為' },
        { term: '国際人権規約', yomigana: 'こくさいじんけんきやく', desc: '国際的に人権を保障するための条約' },
        { term: '国際慣習法', yomigana: 'こくさいかんしゅうほう', desc: '国家間で繰り返される慣行が法として認められたもの' },
        { term: '公務員の守秘義務', yomigana: 'こうむいんのしゅひぎむ', desc: '職務上知り得た秘密を漏らしてはならない義務' },
        { term: '司法権の独立', yomigana: 'しほうけんのどくりつ', desc: '裁判所が他の権力から独立して職務を行う原則' },
        { term: '法の支配', yomigana: 'ほうのしはい', desc: '権力行使は全て法律に従うべきという考え方' },
        { term: '裁判の公開', yomigana: 'さいばんのこうかい', desc: '裁判は原則として公開で行うという原則' },
        { term: '参政権', yomigana: 'さんせいけん', desc: '国民が政治に参加する権利' },
        { term: '被選挙権', yomigana: 'ひせんきょけん', desc: '選挙に立候補できる権利' },
        { term: '普通選挙', yomigana: 'ふつうせんきょ', desc: '一定年齢以上の全ての国民に選挙権を与える制度' },
        { term: '成年年齢', yomigana: 'せいねんねんれい', desc: '民法で定められた成人として扱われる年齢（現行18歳）' },
        { term: '婚姻意思', yomigana: 'こんいんいし', desc: '結婚する意思' },
        { term: '親権', yomigana: 'しんけん', desc: '未成年の子を監護教育し財産を管理する権利義務' },
        { term: '後見', yomigana: 'こうけん', desc: '成年被後見人を保護・補助する制度' },
        { term: '保佐', yomigana: 'ほさ', desc: '判断能力が不十分な者を支援する制度' },
        { term: '補助', yomigana: 'ほじょ', desc: '判断能力が一部不十分な者を支援する制度' },
        { term: '相続', yomigana: 'そうぞく', desc: '人が亡くなった際に財産や権利義務を承継すること' },
        { term: '遺言', yomigana: 'ゆいごん', desc: '死後の財産処分などを記した意思表示' },
        { term: '寄与分', yomigana: 'きよぶん', desc: '被相続人の財産増加に特別寄与した相続人の取り分' },
        { term: '法人格', yomigana: 'ほうじんかく', desc: '法律上の権利義務の主体となる資格' },
        { term: '権利能力', yomigana: 'けんりのうりょく', desc: '権利や義務の主体となる能力' },
        { term: '行為能力', yomigana: 'こういのうりょく', desc: '有効な法律行為を単独で行える能力' },
        { term: '追認', yomigana: 'ついにん', desc: '無権代理行為などを後から有効に認めること' },
        { term: '無効', yomigana: 'むこう', desc: '法律行為が最初から効力を持たないこと' },
        { term: '国家行政組織法', yomigana: 'こっかぎょうせいそしきほう', desc: '国の行政機関の組織を定める法律' },
        { term: '通知', yomigana: 'つうち', desc: '行政庁が特定の事実を知らせる行為' },
        { term: '確認', yomigana: 'かくにん', desc: '一定の事実や状態の存在を認める行為' },
        { term: '公告', yomigana: 'こうこく', desc: '多数人に周知させるための発表' },
        { term: '告示', yomigana: 'こくじ', desc: '行政庁が一定の事項を公式に発表すること' },
        { term: '指示', yomigana: 'しじ', desc: '行政庁が相手に一定の行為を行うよう促す行為' },
        { term: '勧告', yomigana: 'かんこく', desc: '法的義務はないが一定の行為を行うよう求める行為' },
        { term: '調査', yomigana: 'ちょうさ', desc: '行政庁が事実関係を調べる行為' },
        { term: '検査', yomigana: 'けんさ', desc: '行政庁が物や場所などを確認する行為' },
        { term: '聴聞', yomigana: 'ちょうもん', desc: '行政処分を行う前に関係者から意見を聞く手続' },
        { term: '弁明', yomigana: 'べんめい', desc: '自分の立場や行為について説明すること' },
        { term: '申請', yomigana: 'しんせい', desc: '行政庁に許可や認可などを求める行為' },
        { term: '許認可', yomigana: 'きょにんか', desc: '許可や認可をまとめた呼び方' },
        { term: '行政裁量', yomigana: 'ぎょうせいさいりょう', desc: '行政庁が与えられた範囲で判断できる自由度' },
        { term: '義務', yomigana: 'ぎむ', desc: '法律によって課される行為や遵守すべきこと' },
        { term: '権利', yomigana: 'けんり', desc: '法律によって認められる利益を主張する力' },
        { term: '権能', yomigana: 'けんのう', desc: '権利を実行するための具体的な力' },
        { term: '責務', yomigana: 'せきむ', desc: '法律や契約で負うべき責任' },
        { term: '利益', yomigana: 'りえき', desc: '法律上保護される価値や得られる便益' },
        { term: '損害', yomigana: 'そんがい', desc: '権利侵害などにより被る不利益' },
        { term: '過失', yomigana: 'かしつ', desc: '注意を怠ったために損害を与えること' },
        { term: '故意', yomigana: 'こい', desc: '損害や結果を予測・認識しつつ行うこと' },
        { term: '不作為義務', yomigana: 'ふさくいぎむ', desc: 'ある行為をしない義務' },
        { term: '作為義務', yomigana: 'さくいぎむ', desc: 'ある行為をする義務' },
        { term: '強行法規', yomigana: 'きょうこうほうき', desc: '当事者の合意で排除できない法規' },
        { term: '信教の自由', yomigana: 'しんきょうのじゆう', desc: '宗教を信じる・信じない自由および宗教活動の自由' },
        { term: '臨時国会', yomigana: 'りんじこっかい', desc: '特定の必要がある場合に召集される国会' },
        { term: '議院内閣制', yomigana: 'ぎいんないかくせい', desc: '内閣が国会の信任に基づいて成り立つ政治制度' },
        { term: '住民投票', yomigana: 'じゅうみんとうひょう', desc: '地方自治体で重要事項を住民が直接投票で決める制度' },
        { term: '贈与契約', yomigana: 'ぞうよけいやく', desc: '無償で財産を与える契約' },
        { term: '意思表示', yomigana: 'いしひょうじ', desc: '意思を外部に表す行為' },
        { term: '表意者', yomigana: 'ひょういしゃ', desc: '意思表示を行う者' },
        { term: '法律行為', yomigana: 'ほうりつこうい', desc: '一定の法律効果を生じさせる人の行為' },
        { term: '法律関係', yomigana: 'ほうりつかんけい', desc: '権利義務が存在する関係' },
        { term: '権利濫用', yomigana: 'けんりらんよう', desc: '権利を本来の目的に反して行使すること' },
        { term: '消費貸借契約', yomigana: 'しょうひたいしゃくけいやく', desc: '金銭などを借り受け消費し後に返す契約' },
        { term: '事務管理', yomigana: 'じむかんり', desc: '法律上の義務なく他人の事務を処理する行為' }
    ];

    // --- Game Flow ---
    function startGame() {
        // Shuffle and pick 10 questions
        const uniqueQuestions = [...new Map(allQuestions.map(item => [item.term, item])).values()];
        currentQuestions = [...uniqueQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
        
        // Reset state
        questionIndex = 0;
        gameStartTime = new Date();

        // Update UI
        startScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        startButton.classList.add('hidden');
        retryButton.classList.add('hidden'); // Hide retry button at start

        displayNextQuestion();
    }

    function displayNextQuestion() {
        if (questionIndex >= currentQuestions.length) {
            endGame();
            return;
        }

        const q = currentQuestions[questionIndex];
        questionTerm.textContent = q.term;
        questionYomigana.textContent = q.yomigana;
        
        // Reset for next question
        inputArea.disabled = false; // Re-enable input
        inputArea.value = '';
        inputArea.classList.remove('wrong');
        inputArea.focus();
        feedbackMessage.textContent = '';
        explanation.textContent = '';
        explanation.classList.add('hidden');
        shihanImage.src = IDLE_IMG;
    }

    function endGame() {
        const elapsedTime = ((new Date() - gameStartTime) / 1000).toFixed(1); // in seconds, 1 decimal place

        finalTime.textContent = `${elapsedTime}秒`;
        resultMessage.textContent = getResultMessage(elapsedTime);

        questionScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        retryButton.classList.remove('hidden'); // Show retry button on results
        inputArea.disabled = true;
    }

    function getResultMessage(time) {
        if (time <= 60) return 'お見事！達人の域じゃな。'
        if (time <= 90) return 'なかなかの腕前。その調子じゃ。';
        if (time <= 120) return 'まだまだ修行が足りぬな。';
        return '出直すがよい。';
    }

    // --- Input Handling ---
    function handleInput(e) {
        // Check for Enter or Space key
        if (e.key !== 'Enter' && e.code !== 'Space') return;
        
        e.preventDefault(); // Prevent typing a space

        const userAnswer = normalize(inputArea.value);
        if (userAnswer === '') return; // Ignore empty submission

        const correctAnswer = normalize(currentQuestions[questionIndex].yomigana);

        if (userAnswer === correctAnswer) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
        }
    }
    
    function normalize(str) {
        // Zenkaku/Hankaku alphabet to Hankaku, then to lowercase
        return str.replace(/[Ａ-Ｚａ-ｚ]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        }).toLowerCase();
    }

    function handleCorrectAnswer() {
        inputArea.disabled = true; // Disable input during explanation
        feedbackMessage.textContent = '正解じゃ！';
        feedbackMessage.classList.add('correct');
        shihanImage.src = CORRECT_IMG;
        
        const q = currentQuestions[questionIndex];
        explanation.textContent = q.desc;
        explanation.classList.remove('hidden');

        // Move to the next question after a delay
        setTimeout(() => {
            questionIndex++;
            displayNextQuestion();
            feedbackMessage.classList.remove('correct');
        }, 2500); // 2.5 second delay to read explanation
    }

    function handleWrongAnswer() {
        shihanImage.src = WRONG_IMG;
        inputArea.classList.add('wrong');
        inputArea.value = ''; // Reset input
        
        // Shake animation
        shihanImage.style.transform = 'translateX(-10px)';
        setTimeout(() => { shihanImage.style.transform = 'translateX(10px)'; }, 100);
        setTimeout(() => { shihanImage.style.transform = 'translateX(-10px)'; }, 200);
        setTimeout(() => { shihanImage.style.transform = 'translateX(0px)'; }, 300);
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    retryButton.addEventListener('click', startGame); // Retry button also starts a new game
    inputArea.addEventListener('keydown', handleInput);

    // Allow restart from result screen with Enter key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !resultScreen.classList.contains('hidden')) {
            startGame();
        }
    });
});
