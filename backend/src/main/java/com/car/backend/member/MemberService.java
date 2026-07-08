package com.car.backend.member;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberMapper memberMapper;

    public int join(MemberDTO memberDTO) {

        if (memberDTO.getMemberType() == null || memberDTO.getMemberType().isBlank()) {
            memberDTO.setMemberType("NORMAL");
        }

        if (memberDTO.getStatus() == null || memberDTO.getStatus().isBlank()) {
            memberDTO.setStatus("ACTIVE");
        }

        return memberMapper.add(memberDTO);
    }

    public MemberDTO findByLoginId(String loginId) {
        return memberMapper.findByLoginId(loginId);
    }
}