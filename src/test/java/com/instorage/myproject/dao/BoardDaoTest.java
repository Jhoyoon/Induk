package com.instorage.myproject.dao;

import com.instorage.myproject.domain.BoardDto;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/spring/root-context.xml"})
public class BoardDaoTest extends TestCase {
    @Autowired
    BoardDao boardDao;
    @Test
    public void testCount() {
        boardDao.deleteAll();
        int rowCnt=boardDao.count();
        assertTrue(rowCnt == 0);
    }
    @Test
    public void testDeleteAll(){
        boardDao.deleteAll();
        int rowCnt = boardDao.deleteAll();
        assertTrue(rowCnt==0);
    }
    @Test
    public void testDelete(){
        int rowCnt=boardDao.delete(3,"writer");
        System.out.println(rowCnt);
        assertTrue(rowCnt == 1);
        rowCnt=boardDao.deleteAll();
        assertTrue(rowCnt == 1);
    }
    @Test
    public void testInsert(){
        boardDao.deleteAll();
        BoardDto boardDto = new BoardDto("writer","title","content");
        int rowCnt=boardDao.insert(boardDto);
        assertTrue(rowCnt==1);
        rowCnt=boardDao.deleteAll();
        assertTrue(rowCnt==1);
    }
    @Test
    public void testSelect(){
        boardDao.deleteAll();
        boardDao.insert(new BoardDto("writer","title","content"));
        BoardDto boardDto=boardDao.select(1);
        assertTrue(boardDto != null);
        assertTrue(boardDto.getTitle().equals("title"));
    }
    @Test
    public void testAuto(){
        boardDao.auto();
    }
    @Test
    public void testUpdate(){
        boardDao.deleteAll();
        boardDao.insert(new BoardDto("writer","title","content"));
        BoardDto boardDto = new BoardDto("writer","title2","content2");
        boardDto.setBno(1);
        int rowCnt = boardDao.update(boardDto);
        assertTrue(rowCnt == 1);
        BoardDto boardDto2 = boardDao.select(1);
        assertTrue(boardDto2.getTitle().equals("title2"));
        boardDao.deleteAll();
    }
    @Test
    public void testSelectAll(){
        boardDao.deleteAll();
        boardDao.insert(new BoardDto("writer","title","content"));
        boardDao.insert(new BoardDto("writer","title2","content2"));
        List<BoardDto> list =boardDao.selectAll();
        BoardDto boardDto1 = list.get(0);
        BoardDto boardDto2 = list.get(1);
        assertTrue(boardDto1.getTitle().equals("title2"));
        assertTrue(boardDto2.getTitle().equals("title"));
        boardDao.deleteAll();
    }
    @Test
    public void testTest(){
        boardDao.deleteAll();
    }
    @Test
    public void testSelectPage(){
        boardDao.deleteAll();
        for(int i=0;i<=9;i++){
            boardDao.insert(new BoardDto("writer","title"+i,"content"));
        }
        Map map = new HashMap();
        map.put("offset",0);
        map.put("pageSize",10);
        List<BoardDto> list = boardDao.selectPage(map);
        for(int i=0;i<=9;i++){
            assertTrue(list.get(i).getTitle().equals("title"+i));
        }
        boardDao.deleteAll();
    }
    @Test
    public void testIncreaseCnt(){
        boardDao.deleteAll();
        boardDao.insert(new BoardDto("writer","title","content"));
        BoardDto boardDto = boardDao.select(1);
        boardDto.setComment_cnt(0);
        int rowCnt = boardDao.increaseViewCnt(1);
        assertTrue(rowCnt == 1);
        boardDao.deleteAll();
    }
}