let modelValue = "${model.attribute}";

let bno = modelValue.board.bno;
// ********************************************************
// 페이지 방문시 댓글 생성 호출 함수
$(document).ready(function (){
    showList(bno);                                      // ******* 페이지 방문시 모든 댓글 생성
})
// json 요청으로 모든 댓글을 만들어준다
let showList = function (bno){
    $.ajax({
        type:'get',       // 요청 메서드
        url: '/instorage/comments?bno='+bno,  // 요청 URI
        dataType : 'json', // 전송받을 데이터의 타입
        success : function(result){ // 콜백함수
            $("#commentTest").html(doHtml(result));
        },
        error   : function(){ alert("error") } // 에러가 발생했을 때, 호출될 함수
    }); // $.ajax()
}
// **********************************************************
// 댓글 작성

$("#sendBtn").click(function (){
    // 이제 버튼 클릭시 write 이벤트를 작동시켜야 함
    write(bno);
}); // sendBtn
let write = function (){
    let comment = $("#comment").val();
    if(comment.trim() == ''){
        alert("내용을 입력해주세요.");
        return;
    }
    $.ajax({
        type:'post',       // 요청 메서드
        url: '/instorage/comments?bno='+bno,  // 요청 URI
        dataType : 'text', // 전송받을 데이터의 타입
        headers : { "content-type": "application/json"}, // 요청 헤더
        data : JSON.stringify({"comment":comment}),
        success : function(result){ // 콜백함수
            alert("댓글 등록 성공");
            showList(bno);
        },
        error   : function(){ alert("error") } // 에러가 발생했을 때, 호출될 함수
    }); // $.ajax()
}
// ************************************************************************************

// 댓글 수정 기능
$("#commentTest").on("click",".updateBtn",function (){

    let liElement = $(this).parent();

    makeUpdate(liElement);
})
let makeUpdate = function (liElement){
    let commentText = liElement.find('span').text();
    // Check if updateInput and saveBtn already exists, if yes, remove them
    if(liElement.find('.updateInput').length > 0){
        liElement.find('.updateInput').remove();
        liElement.find('.saveBtn').remove();
    }
    liElement.append('<input type="text" class="updateInput" value="'+commentText+'"><button class="saveBtn">저장</button>');
}
$("#commentTest").on("click",".saveBtn",function (event){
    event.preventDefault();
    let liElement = $(this).parent();

    let cno = liElement.attr("data-cno");

    let updatedComment = liElement.find('.updateInput').val();
    update(cno, updatedComment);
});
let update = function(cno, comment){
    $.ajax({
        type:'patch',       // 요청 메서드
        url: '/instorage/comments/'+cno,  // 요청 URI
        dataType : 'text', // 전송받을 데이터의 타입
        headers : { "content-type": "application/json"}, // 요청 헤더
        data : JSON.stringify({"comment":comment}),
        success : function(){ // 콜백함수
            alert("댓글 수정 성공");
            showList(bno);
        },
        error   : function(){ alert("error") } // 에러가 발생했을 때, 호출될 함수
    }); // $.ajax()
}

// ************************************************************************
// 댓글 삭제 기능
$("#commentTest").on("click",".deleteBtn",function (){
    let cno = $(this).parent().attr("data-cno");
    let bno = $(this).parent().attr("data-bno");
    $.ajax({
        type:'delete',       // 요청 메서드
        url: '/instorage/comments/'+cno+'?bno='+bno,  // 요청 URI
        dataType : 'text', // 전송받을 데이터의 타입
        success : function(){ // 콜백함수
            alert("삭제 성공");
            showList(bno);
        },
        error   : function(){ alert("error") } // 에러가 발생했을 때, 호출될 함수
    }); // $.ajax()
    //alert("삭제 작동");
})
// *********************************************************************************************************
// 답글을 만들어준다
$("#commentTest").on("click",".replyBtn",function (){
    // 보이게 만들고
    $("#replyBox").css("display","block");
    // 답글 버튼 부모의 자식으로 만들다.
    $("#replyBox").appendTo($(this).parent())
})

// 답글 저장 로직
$("#replySendBtn").click(function (){
    // 이제 버튼 클릭시 write 이벤트를 작동시켜야 함
    replyWrite();
}); // sendBtn
let replyWrite = function (){
    let comment = $("#replyInput").val();
    let cno=$("#replyBox").parent().attr("data-cno");
    console.log(cno);
    if(comment.trim() == ''){
        alert("내용을 입력해주세요.");
        $("#replInput").focus();
        return;
    }
    $.ajax({
        type:'post',       // 요청 메서드
        url: '/instorage/comments?bno='+bno,  // 요청 URI
        dataType : 'text', // 전송받을 데이터의 타입
        headers : { "content-type": "application/json"}, // 요청 헤더
        data : JSON.stringify({"pcno":cno,"comment":comment}),
        success : function(result){ // 콜백함수
            alert("댓글 등록 성공");
            showList(bno);
        },
        error   : function(){ alert("error") } // 에러가 발생했을 때, 호출될 함수
    }); // $.ajax()
    $("#replyBox").css("display","none");
    $("#replyInput").val('');
    $("#replyBox").appendTo("body");
}
// ****************************************************************************



let doHtml = function (comments){
    let tmp = "<ul>";
    comments.forEach(function (comments){
        tmp = tmp + "<li data-cno='"+comments.cno+"'"
        tmp = tmp + " data-bno='"+comments.bno+"'"
        tmp = tmp + " data-pcno='"+comments.pcno+"'>"
        if(comments.cno != comments.pcno){
            tmp = tmp + "ㄴ"
        }
        tmp = tmp + " comment= "+"<span>"+comments.comment+"</span>"
        tmp = tmp + " commenter= "+comments.commenter
        tmp = tmp + " reg_date= "+comments.reg_date
        tmp = tmp + "<button class='deleteBtn'>삭제</button>"
        tmp = tmp + "<button class='updateBtn'>수정</button>"
        if(comments.cno == comments.pcno)
            tmp = tmp + "<button class='replyBtn'>답글</button>"
        tmp = tmp + "</li>"
    })
    return tmp+"</ul>";
}