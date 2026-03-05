const table = document.querySelector("body > div.wrap-fullwidth > div.inside-content > div.elementor.elementor-3730 > div > div > div > div > table");
const body = table.children[0]
const bodyChildren = body.children;
const data = []
for(let i=2;i<bodyChildren.length;i++) {
    const item = bodyChildren[i];
    data.push({
        stt: item.children[0].children[0]?.innerText,
        id: item.children[1].children[0]?.innerText,
        name: item.children[2].children[0]?.innerText,
        hanoi: {
            scoreTHPT: item.children[3].children[0]?.innerText,
            scoreTN: item.children[4].children[0]?.innerText,
            scoreKH: item.children[5].children[0]?.innerText,
            scoreDGNL: item.children[6].children[0]?.innerText,
        },
        hcm: {
            scoreTHPT: item.children[7].children[0]?.innerText,
            scoreTN: item.children[8].children[0]?.innerText,
            scoreKH: item.children[9].children[0]?.innerText,
            scoreDGNL: item.children[10].children[0]?.innerText,
        }
    })
}
function cleanScore(text) {
  if (!text || text === "–") return "Chưa có dữ liệu";
  return text.replace(/TTNV.*$/, "").trim();
}
function convertToRAG(data) {
  const docs = [];
  data.forEach(item => {
    const doc = `
Ngành: ${item.name}
Mã ngành: ${item.id || "Không có"}
Trường: Học viện Công nghệ Bưu chính Viễn thông (PTIT)
Năm tuyển sinh: 2025

Cơ sở Hà Nội
- Điểm xét tuyển THPT: ${cleanScore(item.hanoi.scoreTHPT)}
- Điểm xét tuyển tài năng: ${cleanScore(item.hanoi.scoreTN)}
- Điểm xét học bạ kết hợp: ${cleanScore(item.hanoi.scoreKH)}
- Điểm đánh giá năng lực: ${cleanScore(item.hanoi.scoreDGNL)}

Cơ sở TP.HCM
- Điểm xét tuyển THPT: ${cleanScore(item.hcm.scoreTHPT)}
- Điểm xét tuyển tài năng: ${cleanScore(item.hcm.scoreTN)}
- Điểm xét học bạ kết hợp: ${cleanScore(item.hcm.scoreKH)}
- Điểm đánh giá năng lực: ${cleanScore(item.hcm.scoreDGNL)}
`.trim();
    docs.push(doc);
  });
  return docs.join("\n\n------------------------\n\n");
}

const ragText = convertToRAG(data);

console.log(ragText);
