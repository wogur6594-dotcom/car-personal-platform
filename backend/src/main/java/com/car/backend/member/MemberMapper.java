package com.car.backend.member;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    int add(MemberDTO memberDTO);

    MemberDTO findByLoginId(String loginId);
}